import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Image,
  FileText,
  Clock,
  Calendar,
  CheckCircle,
  Send,
  Plus,
  X,
  File,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnnotationCanvas from '@/components/common/AnnotationCanvas';
import { useClassStore } from '@/store/useClassStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate, isOverdue, getDaysRemaining } from '@/utils';
import type { Answer } from '@/types';

const StudentAssignmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuthStore();
  const { getAssignmentById, getSubmissionsByStudentId, addSubmission } = useClassStore();

  const assignment = getAssignmentById(id || '');
  const studentId = currentUser?.id || 's1';
  const submissions = getSubmissionsByStudentId(studentId);
  const existingSubmission = submissions.find(s => s.assignmentId === id);

  const [activeTab, setActiveTab] = useState<'info' | 'submit'>('info');
  const [images, setImages] = useState<string[]>(existingSubmission?.images || []);
  const [answers, setAnswers] = useState<Answer[]>(
    existingSubmission?.answers || 
    (assignment?.questions.map(q => ({ questionId: q.id, answer: '' })) || [])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!assignment) {
    return (
      <Layout role="student">
        <div className="text-center py-16">
          <p className="text-neutral-500">作业不存在</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary mt-4">
            返回首页
          </button>
        </div>
      </Layout>
    );
  }

  const isSubmitted = !!existingSubmission;
  const isGraded = existingSubmission?.status === 'graded';
  const overdue = isOverdue(assignment.dueDate);
  const daysRemaining = getDaysRemaining(assignment.dueDate);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, answer: value } : a
    ));
  };

  const handleSubmit = () => {
    if (images.length === 0 && answers.every(a => !a.answer)) {
      alert('请至少上传一张图片或填写一道题目');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newSubmission = {
        id: `sub-${Date.now()}`,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        studentId,
        studentName: currentUser?.name || '',
        studentAvatar: currentUser?.avatar || '',
        studentNo: '2024001',
        images,
        answers,
        submittedAt: new Date().toISOString(),
        status: 'submitted' as const,
        score: null,
        comment: '',
        gradedAt: null,
        annotations: [],
        isLate: overdue
      };
      
      addSubmission(newSubmission);
      setIsSubmitting(false);
      setActiveTab('info');
    }, 1000);
  };

  if (isGraded) {
    return <GradingResult assignment={assignment} submission={existingSubmission!} />;
  }

  return (
    <Layout role="student">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{assignment.title}</h1>
              {isSubmitted && <span className="badge badge-success">已提交</span>}
              {overdue && <span className="badge badge-danger">已截止</span>}
            </div>
            <p className="text-neutral-500 mt-1">{assignment.className}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              overdue ? 'bg-danger-100' : 'bg-white'
            }`}>
              <Clock className={`w-6 h-6 ${overdue ? 'text-danger-500' : 'text-primary-500'}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">截止时间</p>
              <p className={`font-semibold ${overdue ? 'text-danger-600' : 'text-neutral-800'}`}>
                {formatDate(assignment.dueDate)}
              </p>
            </div>
          </div>
          <div className="text-right">
            {overdue ? (
              <span className="text-danger-600 font-medium">已截止</span>
            ) : (
              <div>
                <p className="text-2xl font-bold text-primary-600">{daysRemaining}</p>
                <p className="text-sm text-neutral-500">天后截止</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'info'
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            作业详情
            {activeTab === 'info' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'submit'
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {isSubmitted ? '我的提交' : '提交作业'}
            {activeTab === 'submit' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>

        {activeTab === 'info' && (
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">作业说明</h3>
              <p className="text-neutral-600 leading-relaxed">{assignment.description}</p>
            </div>

            {assignment.questions.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="font-semibold text-neutral-800 mb-4">
                  题目列表
                  <span className="text-sm font-normal text-neutral-500 ml-2">
                    共 {assignment.questions.length} 题，{assignment.totalScore} 分
                  </span>
                </h3>
                <div className="space-y-4">
                  {assignment.questions.map((q, index) => (
                    <div key={q.id} className="p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {q.type === 'choice' ? '单选题' : 
                           q.type === 'fill_blank' ? '填空题' :
                           q.type === 'short_answer' ? '简答题' : '作文题'}
                        </span>
                        <span className="text-sm text-neutral-500 ml-auto">{q.score} 分</span>
                      </div>
                      <p className="text-neutral-700">{q.content}</p>
                      {q.options && q.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                              <span className="w-5 h-5 border border-neutral-300 rounded-full flex items-center justify-center">
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assignment.referenceMaterials.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="font-semibold text-neutral-800 mb-3">参考资料</h3>
                <div className="space-y-2">
                  {assignment.referenceMaterials.map(mat => (
                    <div
                      key={mat.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg border border-neutral-200 flex items-center justify-center">
                        {mat.type === 'pdf' && <File className="w-5 h-5 text-danger-500" />}
                        {mat.type === 'image' && <Image className="w-5 h-5 text-success-500" />}
                        {mat.type === 'doc' && <File className="w-5 h-5 text-primary-500" />}
                        {mat.type === 'link' && <BookOpen className="w-5 h-5 text-accent-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-700">{mat.name}</p>
                        {mat.size && <p className="text-xs text-neutral-500">{mat.size}</p>}
                      </div>
                      <span className="text-sm text-primary-600">查看</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSubmitted && !overdue && (
              <div className="pt-6">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="btn btn-primary w-full py-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  开始提交作业
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-neutral-800 mb-4">上传作业图片</h3>
              <p className="text-sm text-neutral-500 mb-4">
                支持拍照上传手写作业，可上传多张图片
              </p>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt=""
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      {!isSubmitted && !overdue && (
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                        第{index + 1}张
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!isSubmitted && !overdue && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                  >
                    <Upload className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-500">点击或拖拽上传图片</p>
                    <p className="text-xs text-neutral-400 mt-1">支持 JPG、PNG 格式</p>
                  </div>
                </>
              )}
            </div>

            {assignment.questions.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-neutral-800 mb-4">在线答题</h3>
                <div className="space-y-6">
                  {assignment.questions.map((q, index) => {
                    const answer = answers.find(a => a.questionId === q.id);
                    return (
                      <div key={q.id} className="pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-neutral-500">{q.score} 分</span>
                        </div>
                        <p className="text-neutral-700 mb-3">{q.content}</p>
                        
                        {q.type === 'choice' && q.options && (
                          <div className="space-y-2">
                            {q.options.map((opt, i) => (
                              <label
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                  answer?.answer === opt
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-neutral-200 hover:border-neutral-300'
                                } ${isSubmitted || overdue ? 'cursor-default' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={answer?.answer === opt}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  disabled={isSubmitted || overdue}
                                  className="sr-only"
                                />
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  answer?.answer === opt
                                    ? 'border-primary-500'
                                    : 'border-neutral-300'
                                }`}>
                                  {answer?.answer === opt && (
                                    <span className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                                  )}
                                </span>
                                <span className="text-neutral-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill_blank' && (
                          <input
                            type="text"
                            className="input"
                            placeholder="请输入答案"
                            value={(answer?.answer as string) || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            disabled={isSubmitted || overdue}
                          />
                        )}

                        {(q.type === 'short_answer' || q.type === 'essay') && (
                          <textarea
                            className="input min-h-[120px] resize-y"
                            placeholder="请输入答案..."
                            value={(answer?.answer as string) || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            disabled={isSubmitted || overdue}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!isSubmitted && !overdue && (
              <div className="flex gap-3 pb-8">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="btn btn-secondary flex-1"
                >
                  保存草稿
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>提交中...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      提交作业
                    </>
                  )}
                </button>
              </div>
            )}

            {isSubmitted && (
              <div className="card p-6 bg-success-50 border-success-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-success-800">作业已提交</h3>
                    <p className="text-sm text-success-600">
                      提交时间：{formatDate(existingSubmission?.submittedAt || '')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {overdue && !isSubmitted && (
              <div className="card p-6 bg-danger-50 border-danger-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-danger-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-danger-800">作业已截止</h3>
                    <p className="text-sm text-danger-600">
                      该作业已超过提交时间，无法提交
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const GradingResult = ({ assignment, submission }: { assignment: any; submission: any }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <Layout role="student">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{assignment.title}</h1>
              <span className="badge badge-success">已批改</span>
            </div>
            <p className="text-neutral-500 mt-1">{assignment.className}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-success-50 to-primary-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
              <div>
                <p className="text-neutral-600">你的得分</p>
                <p className="text-4xl font-bold text-neutral-800">
                  {submission.score}
                  <span className="text-lg font-normal text-neutral-500">/{assignment.totalScore}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">批改老师</p>
              <p className="font-medium text-neutral-800">{submission.gradedBy}</p>
              <p className="text-xs text-neutral-400 mt-1">
                批改时间：{formatDate(submission.gradedAt || '')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">作业图片（含批改）</h3>
              </div>
              <div className="p-4">
                {submission.images && submission.images.length > 0 ? (
                  <>
                    <div className="bg-neutral-100 rounded-xl overflow-hidden">
                      <AnnotationCanvas
                        imageUrl={submission.images[selectedImage]}
                        annotations={submission.annotations || []}
                        readOnly
                      />
                    </div>
                    {submission.images.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {submission.images.map((_: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all ${
                              selectedImage === index
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <span className="text-xs text-neutral-500">第{index + 1}张</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>未上传图片</p>
                  </div>
                )}
              </div>
            </div>

            {submission.answers && submission.answers.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-neutral-800">答题详情</h3>
                </div>
                <div className="p-6 space-y-6">
                  {submission.answers.map((answer: any, index: number) => {
                    const question = assignment.questions.find(
                      (q: any) => q.id === answer.questionId
                    );
                    return (
                      <div key={answer.questionId} className="pb-6 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-neutral-800">
                            第 {index + 1} 题
                          </span>
                          <div className="flex items-center gap-2">
                            {answer.isCorrect ? (
                              <span className="flex items-center text-success-600 text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                正确
                              </span>
                            ) : (
                              <span className="flex items-center text-danger-600 text-sm">
                                <X className="w-4 h-4 mr-1" />
                                错误
                              </span>
                            )}
                            <span className="text-sm font-medium text-primary-600">
                              {answer.score ?? 0}/{question?.score ?? 0}分
                            </span>
                          </div>
                        </div>
                        <p className="text-neutral-700 mb-3">{question?.content}</p>
                        <div className="space-y-2">
                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-neutral-500 mb-1">你的答案</p>
                            <p className="text-neutral-700">
                              {Array.isArray(answer.answer)
                                ? answer.answer.join(', ')
                                : answer.answer || '未作答'}
                            </p>
                          </div>
                          {question?.correctAnswer && (
                            <div className="p-3 bg-success-50 rounded-lg">
                              <p className="text-xs text-success-600 mb-1">正确答案</p>
                              <p className="text-success-700">
                                {Array.isArray(question.correctAnswer)
                                  ? question.correctAnswer.join(', ')
                                  : question.correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">老师评语</h3>
              </div>
              <div className="p-6">
                <div className="p-4 bg-primary-50 rounded-xl">
                  <p className="text-neutral-700 leading-relaxed">
                    {submission.comment || '暂无评语'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">提交信息</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">提交时间</span>
                  <span className="text-neutral-700">{formatDate(submission.submittedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">提交状态</span>
                  <span className="text-success-600">
                    {submission.isLate ? '迟交' : '按时提交'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">批改时间</span>
                  <span className="text-neutral-700">{formatDate(submission.gradedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">图片数量</span>
                  <span className="text-neutral-700">{submission.images?.length || 0} 张</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn btn-primary w-full"
            >
              返回作业大厅
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentAssignmentDetail;
