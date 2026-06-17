import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  User
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnnotationCanvas from '@/components/common/AnnotationCanvas';
import { useClassStore } from '@/store/useClassStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { formatDateTime } from '@/utils';
import type { Annotation, Submission } from '@/types';

const GradingList = () => {
  const navigate = useNavigate();
  const { assignments, getAssignmentsByTeacherId, getSubmissionsByAssignmentId } = useClassStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const allAssignments = getAssignmentsByTeacherId('t1');
  
  const pendingAssignments = allAssignments.filter(a => {
    const submissions = getSubmissionsByAssignmentId(a.id);
    return submissions.some(s => s.status === 'submitted');
  });

  const filteredAssignments = allAssignments.filter(a => {
    const matchSearch = a.title.includes(searchQuery);
    if (filterStatus === 'pending') {
      const submissions = getSubmissionsByAssignmentId(a.id);
      return submissions.some(s => s.status === 'submitted') && matchSearch;
    }
    return matchSearch;
  });

  return (
    <Layout role="teacher">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">作业批改</h1>
            <p className="text-neutral-500">{pendingAssignments.length} 份作业等待批改</p>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索作业..."
                className="input pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input w-36"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">全部作业</option>
                <option value="pending">待批改</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="card py-16 text-center">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-600 mb-2">暂无待批改作业</h3>
              <p className="text-neutral-400">所有作业都已批改完成</p>
            </div>
          ) : (
            filteredAssignments.map(assignment => {
              const submissions = getSubmissionsByAssignmentId(assignment.id);
              const pendingCount = submissions.filter(s => s.status === 'submitted').length;
              const gradedCount = submissions.filter(s => s.status === 'graded').length;

              return (
                <div
                  key={assignment.id}
                  className="card p-6 hover:border-primary-300 cursor-pointer transition-all"
                  onClick={() => navigate(`/teacher/grading/${assignment.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-neutral-800 text-lg">
                          {assignment.title}
                        </h3>
                        {pendingCount > 0 && (
                          <span className="badge badge-warning">
                            {pendingCount} 份待批
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        {assignment.className} · 共 {submissions.length} 份提交
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success-600">{gradedCount}</p>
                        <p className="text-xs text-neutral-500">已批改</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-warning-600">{pendingCount}</p>
                        <p className="text-xs text-neutral-500">待批改</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-300" />
                    </div>
                  </div>
                  {assignment.totalStudents > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full"
                          style={{ width: `${(gradedCount / assignment.totalStudents) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-2 text-right">
                        批改进度 {Math.round((gradedCount / assignment.totalStudents) * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

const GradingDetail = () => {
  const navigate = useNavigate();
  const { assignmentId, submissionId } = useParams();
  const { 
    getAssignmentById, 
    getSubmissionsByAssignmentId, 
    gradeSubmission,
    updateSubmission
  } = useClassStore();
  const { addNotification } = useNotificationStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTab, setActiveTab] = useState<'image' | 'answer'>('image');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [questionComments, setQuestionComments] = useState<Record<string, string>>({});

  const assignment = getAssignmentById(assignmentId || '');
  const submissions = getSubmissionsByAssignmentId(assignmentId || '');
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const displaySubmissions = submissionId ? submissions : pendingSubmissions;
  const currentSubmission = displaySubmissions[currentIndex];

  useEffect(() => {
    if (submissionId) {
      const idx = displaySubmissions.findIndex(s => s.id === submissionId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [submissionId, displaySubmissions.length]);

  useEffect(() => {
    if (currentSubmission) {
      setAnnotations(currentSubmission.annotations || []);
      setCurrentImageIndex(0);
      setScore(currentSubmission.score);
      setComment(currentSubmission.comment || '');

      if (currentSubmission.status === 'graded' && currentSubmission.answers) {
        const scores: Record<string, number> = {};
        const comments: Record<string, string> = {};
        currentSubmission.answers.forEach((a) => {
          if (a.score !== undefined) {
            scores[a.questionId] = a.score;
          }
          comments[a.questionId] = a.comment || '';
        });
        setQuestionScores(scores);
        setQuestionComments(comments);
      } else {
        setQuestionScores({});
        setQuestionComments({});
      }
    }
  }, [currentSubmission?.id]);

  const totalQuestionScore = Object.values(questionScores).reduce(
    (sum, val) => sum + (typeof val === 'number' && !isNaN(val) ? val : 0),
    0
  );

  const totalQuestions = assignment?.questions?.length || 0;
  const scoredCount = Object.values(questionScores).filter(
    val => typeof val === 'number' && !isNaN(val)
  ).length;
  const unscoredCount = totalQuestions - scoredCount;

  useEffect(() => {
    if (assignment?.questions && assignment.questions.length > 0) {
      setScore(totalQuestionScore);
    }
  }, [totalQuestionScore, assignment?.questions?.length]);

  if (!assignment) {
    return (
      <Layout role="teacher">
        <div className="text-center py-16">
          <p className="text-neutral-500">作业不存在</p>
        </div>
      </Layout>
    );
  }

  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < displaySubmissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmitGrade = () => {
    if (currentSubmission && score !== null) {
      if (totalQuestions > 0 && unscoredCount > 0) {
        const confirmed = window.confirm(`还有 ${unscoredCount} 道题未给分，确认提交吗？`);
        if (!confirmed) return;
      }

      const finalScore = score;

      const updatedAnswers = (currentSubmission.answers || []).map(a => ({
        ...a,
        score: questionScores[a.questionId],
        comment: questionComments[a.questionId] || ''
      }));

      updateSubmission(currentSubmission.id, { answers: updatedAnswers });
      gradeSubmission(currentSubmission.id, finalScore, comment, annotations);

      addNotification({
        userId: currentSubmission.studentId,
        userRole: 'student',
        type: 'assignment_graded',
        title: '作业已批改',
        content: `你的作业"${assignment.title}"已被批改，得分：${finalScore}/${assignment.totalScore}`,
        relatedId: assignment.id,
        relatedType: 'assignment'
      });

      const isPendingMode = !submissionId;
      if (isPendingMode) {
        const remainingAfterGrade = displaySubmissions.length - 1;
        if (remainingAfterGrade <= 0) {
          navigate(`/teacher/grading/${assignmentId}`);
        } else {
          const nextIndex = Math.min(currentIndex, remainingAfterGrade - 1);
          setCurrentIndex(nextIndex);
        }
      } else {
        if (currentIndex < displaySubmissions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          navigate(`/teacher/grading/${assignmentId}`);
        }
      }
    }
  };

  const getScoreColor = (s: number | null) => {
    if (s === null) return 'text-neutral-400';
    const percent = (s / (assignment?.totalScore || 100)) * 100;
    if (percent >= 90) return 'text-success-600';
    if (percent >= 70) return 'text-primary-600';
    if (percent >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <Layout role="teacher">
      <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/teacher/assignments/${assignmentId}`)}
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">{assignment.title}</h1>
              <p className="text-sm text-neutral-500">
                {displaySubmissions.length > 0 
                  ? `第 ${currentIndex + 1} / ${displaySubmissions.length} 份`
                  : '暂无提交'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="btn btn-secondary disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一份
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= displaySubmissions.length - 1}
              className="btn btn-secondary disabled:opacity-40"
            >
              下一份
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {displaySubmissions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-success-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-600 mb-2">全部批改完成！</h3>
              <p className="text-neutral-400 mb-6">这份作业的所有提交都已批改</p>
              <button
                onClick={() => navigate(`/teacher/assignments/${assignmentId}`)}
                className="btn btn-primary"
              >
                返回作业详情
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            <div className="col-span-3 bg-white rounded-xl shadow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-neutral-100">
                <h3 className="font-medium text-neutral-800 mb-3">学生列表</h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索学生..."
                    className="input pl-8 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-50">
                {displaySubmissions.map((sub, index) => (
                  <div
                    key={sub.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`p-3 cursor-pointer transition-colors ${
                      index === currentIndex
                        ? 'bg-primary-50 border-l-4 border-primary-500'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.studentAvatar}
                        alt=""
                        className="w-9 h-9 rounded-full bg-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-800 text-sm truncate">
                            {sub.studentName}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-500 truncate">
                          {formatDateTime(sub.submittedAt)}
                        </p>
                      </div>
                      {sub.status === 'graded' && (
                        <span className={`text-sm font-bold ${getScoreColor(sub.score)}`}>
                          {sub.score}
                        </span>
                      )}
                      {sub.status === 'submitted' && (
                        <span className="w-2 h-2 bg-warning-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-6 bg-white rounded-xl shadow-card overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
                <button
                  onClick={() => setActiveTab('image')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'image'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  作业图片
                </button>
                <button
                  onClick={() => setActiveTab('answer')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'answer'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  答题内容
                </button>
                <div className="flex-1" />
                {currentSubmission?.isLate && (
                  <span className="badge badge-danger">迟交</span>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                {activeTab === 'image' && (
                  currentSubmission?.images && currentSubmission.images.length > 0 ? (
                    <div className="h-full flex flex-col">
                      <AnnotationCanvas
                        imageUrl={currentSubmission.images[currentImageIndex]}
                        annotations={annotations}
                        onChange={setAnnotations}
                        pageIndex={currentImageIndex}
                        submissionId={currentSubmission.id}
                      />
                      {currentSubmission.images.length > 1 && (
                        <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-100 bg-white">
                          <button
                            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                            disabled={currentImageIndex === 0}
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <div className="flex gap-2 overflow-x-auto flex-1">
                            {currentSubmission.images.map((img: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                                  currentImageIndex === index
                                    ? 'border-primary-500 ring-2 ring-primary-200'
                                    : 'border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentImageIndex(Math.min(currentSubmission.images.length - 1, currentImageIndex + 1))}
                            disabled={currentImageIndex >= currentSubmission.images.length - 1}
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-neutral-500 ml-1">
                            {currentImageIndex + 1}/{currentSubmission.images.length}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>该学生未上传图片</p>
                      </div>
                    </div>
                  )
                )}

                {activeTab === 'answer' && (
                  <div className="p-6 h-full overflow-y-auto">
                    {currentSubmission?.answers && currentSubmission.answers.length > 0 ? (
                      <div className="space-y-6">
                        {currentSubmission.answers.map((answer, index) => {
                          const question = assignment.questions.find(
                            q => q.id === answer.questionId
                          );
                          const isScored = typeof questionScores[answer.questionId] === 'number';
                          return (
                            <div key={answer.questionId} className={`pb-6 border-b border-neutral-100 last:border-0 ${!isScored ? 'border-l-4 border-l-warning-500 pl-3' : ''}`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-neutral-800">
                                    第 {index + 1} 题
                                  </span>
                                  {isScored ? (
                                    <span className="badge badge-success">
                                      已给分 <span className="font-bold text-success-700 ml-1">{questionScores[answer.questionId]}</span>
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      待给分
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {answer.isCorrect !== undefined && (
                                    answer.isCorrect ? (
                                      <span className="flex items-center text-success-600 text-sm">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        正确
                                      </span>
                                    ) : (
                                      <span className="flex items-center text-danger-600 text-sm">
                                        <XCircle className="w-4 h-4 mr-1" />
                                        错误
                                      </span>
                                    )
                                  )}
                                  <span className="text-sm text-neutral-500">
                                    {answer.score ?? question?.score ?? 0}/{question?.score ?? 0}分
                                  </span>
                                </div>
                              </div>
                              <p className="text-neutral-700 mb-3">{question?.content}</p>
                              <div className="bg-neutral-50 rounded-lg p-4">
                                <p className="text-sm text-neutral-500 mb-1">学生答案</p>
                                <p className="text-neutral-800">
                                  {Array.isArray(answer.answer) 
                                    ? answer.answer.join(', ') 
                                    : answer.answer || '未作答'}
                                </p>
                              </div>
                              {question?.correctAnswer && (
                                <div className="mt-2">
                                  <p className="text-sm text-neutral-500 mb-1">参考答案</p>
                                  <p className="text-success-600 text-sm">
                                    {Array.isArray(question.correctAnswer)
                                      ? question.correctAnswer.join(', ')
                                      : question.correctAnswer}
                                  </p>
                                </div>
                              )}
                              <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                                <div className="flex items-center gap-3">
                                  <label className="text-sm text-neutral-600 w-16 flex-shrink-0">分数：</label>
                                  <input
                                    type="number"
                                    className="input w-24 inline"
                                    min={0}
                                    max={question?.score ?? 0}
                                    value={questionScores[answer.questionId] ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === '') {
                                        setQuestionScores(prev => ({
                                          ...prev,
                                          [answer.questionId]: undefined as any
                                        }));
                                      } else {
                                        let numVal = Number(val);
                                        const maxScore = question?.score ?? 0;
                                        if (numVal > maxScore) numVal = maxScore;
                                        if (numVal < 0) numVal = 0;
                                        setQuestionScores(prev => ({
                                          ...prev,
                                          [answer.questionId]: numVal
                                        }));
                                      }
                                    }}
                                  />
                                  <span className="text-sm text-neutral-500">
                                    / {question?.score ?? 0} 分
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <label className="text-sm text-neutral-600 w-16 flex-shrink-0">点评：</label>
                                  <input
                                    type="text"
                                    className="input flex-1"
                                    placeholder="本题点评（选填）"
                                    value={questionComments[answer.questionId] ?? ''}
                                    onChange={(e) => {
                                      setQuestionComments(prev => ({
                                        ...prev,
                                        [answer.questionId]: e.target.value
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-neutral-400">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>该作业没有在线答题</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-3 bg-white rounded-xl shadow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-neutral-100">
                <h3 className="font-medium text-neutral-800">打分与评语</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <label className="input-label">学生信息</label>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <img
                      src={currentSubmission?.studentAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full bg-neutral-200"
                    />
                    <div>
                      <p className="font-medium text-neutral-800">
                        {currentSubmission?.studentName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {currentSubmission?.studentNo}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="input-label">提交时间</label>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="w-4 h-4" />
                    {currentSubmission && formatDateTime(currentSubmission.submittedAt)}
                  </div>
                </div>

                <div>
                  <label className="input-label">
                    分数 <span className="text-danger-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      className="input text-center text-xl font-bold"
                      value={score ?? ''}
                      onChange={(e) => setScore(e.target.value ? Number(e.target.value) : null)}
                      placeholder="--"
                    />
                    <span className="text-neutral-500">/ {assignment.totalScore}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[60, 70, 80, 90, 100].map(s => (
                      <button
                        key={s}
                        onClick={() => setScore(Math.min(s, assignment.totalScore))}
                        className="flex-1 py-1.5 text-xs bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        {s}分
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-primary-600">
                      自动汇总：{totalQuestionScore} 分
                    </p>
                    {totalQuestions > 0 && (
                      <p className="text-xs text-neutral-500">
                        已给分 {scoredCount}/{totalQuestions} 题
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="input-label">评语</label>
                  <textarea
                    className="input min-h-[120px] resize-y"
                    placeholder="请输入评语..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['很棒！', '继续加油', '有进步', '需努力', '书写工整'].map(text => (
                      <button
                        key={text}
                        onClick={() => setComment(prev => prev + (prev ? ' ' : '') + text)}
                        className="px-2 py-1 text-xs bg-primary-50 text-primary-600 rounded hover:bg-primary-100 transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>

                {currentSubmission?.status === 'graded' && (
                  <div className="p-3 bg-success-50 rounded-lg">
                    <p className="text-sm text-success-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      已批改
                    </p>
                    {currentSubmission.gradedAt && (
                      <p className="text-xs text-success-600 mt-1">
                        批改时间：{formatDateTime(currentSubmission.gradedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-neutral-100">
                <button
                  onClick={handleSubmitGrade}
                  className="btn btn-primary w-full"
                  disabled={score === null}
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {currentSubmission?.status === 'graded' ? '更新批改' : '提交批改'}
                </button>
                {currentIndex < displaySubmissions.length - 1 && (
                  <p className="text-xs text-center text-neutral-400 mt-2">
                    提交后自动跳转到下一份
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export { GradingList, GradingDetail };
