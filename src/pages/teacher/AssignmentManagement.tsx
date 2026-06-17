import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Upload,
  File,
  Link2,
  Trash2,
  X,
  PlusCircle,
  Save,
  Send,
  Calendar,
  BookOpen,
  Copy
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useClassStore } from '@/store/useClassStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { formatDate, isOverdue, getDaysRemaining } from '@/utils';
import type { Assignment, Question, ReferenceMaterial, QuestionType } from '@/types';

const AssignmentList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { getAssignmentsByTeacherId, getSubmissionsByAssignmentId } = useClassStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const assignments = getAssignmentsByTeacherId(currentUser?.id || 't1');

  const filteredAssignments = assignments.filter(a => {
    const matchSearch = a.title.includes(searchQuery) || a.className.includes(searchQuery);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusBadge = (assignment: Assignment) => {
    if (assignment.status === 'draft') {
      return <span className="badge badge-neutral">草稿</span>;
    }
    if (isOverdue(assignment.dueDate)) {
      return <span className="badge badge-danger">已截止</span>;
    }
    const daysRemaining = getDaysRemaining(assignment.dueDate);
    if (daysRemaining <= 1) {
      return <span className="badge badge-warning">即将截止</span>;
    }
    return <span className="badge badge-success">进行中</span>;
  };

  return (
    <Layout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">作业管理</h1>
            <p className="text-neutral-500 mt-1">共 {assignments.length} 份作业</p>
          </div>
          <button
            onClick={() => navigate('/teacher/assignments/create')}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            布置新作业
          </button>
        </div>

        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索作业名称、班级..."
                className="input pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input w-32"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">全部状态</option>
                <option value="published">进行中</option>
                <option value="draft">草稿</option>
                <option value="closed">已截止</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="card py-16 text-center">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-600 mb-2">暂无作业</h3>
              <p className="text-neutral-400 mb-6">点击右上角按钮布置您的第一份作业</p>
              <button
                onClick={() => navigate('/teacher/assignments/create')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                布置作业
              </button>
            </div>
          ) : (
            filteredAssignments.map(assignment => {
              const submissions = getSubmissionsByAssignmentId(assignment.id);
              const gradedCount = submissions.filter(s => s.status === 'graded').length;
              const submissionRate = assignment.totalStudents > 0 
                ? Math.round((assignment.submissionCount / assignment.totalStudents) * 100) 
                : 0;

              return (
                <div
                  key={assignment.id}
                  className="card p-6 hover:border-primary-300 cursor-pointer transition-all"
                  onClick={() => navigate(`/teacher/assignments/${assignment.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-neutral-800 truncate">
                          {assignment.title}
                        </h3>
                        {getStatusBadge(assignment)}
                        {assignment.subject && (
                          <span className="badge badge-primary">{assignment.subject}</span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 line-clamp-1">
                        {assignment.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {assignment.className}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          截止 {formatDate(assignment.dueDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {assignment.questions.length} 道题
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">
                          {assignment.submissionCount}/{assignment.totalStudents}
                        </p>
                        <p className="text-xs text-neutral-500">已提交</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success-600">{gradedCount}</p>
                        <p className="text-xs text-neutral-500">已批改</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/assignments/create?copy=${assignment.id}`);
                        }}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="复制该作业"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-neutral-300" />
                    </div>
                  </div>
                  {assignment.totalStudents > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-neutral-500">提交进度</span>
                        <span className="font-medium text-neutral-700">{submissionRate}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all"
                          style={{ width: `${submissionRate}%` }}
                        />
                      </div>
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

const AssignmentCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuthStore();
  const { classes, createAssignment, getAssignmentById } = useClassStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalScore, setTotalScore] = useState(100);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [referenceMaterials, setReferenceMaterials] = useState<ReferenceMaterial[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'choice',
    content: '',
    score: 10,
    options: ['', '', '', '']
  });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myClasses = classes.filter(c => c.teacherId === (currentUser?.id || 't1'));

  useEffect(() => {
    const copyId = searchParams.get('copy');
    if (copyId) {
      const sourceAssignment = getAssignmentById(copyId);
      if (sourceAssignment) {
        setTitle(sourceAssignment.title + '（副本）');
        setDescription(sourceAssignment.description);
        setTotalScore(sourceAssignment.totalScore);
        setSubject(sourceAssignment.subject || '');
        setQuestions(
          [...sourceAssignment.questions].map(q => ({
            ...q,
            id: 'q' + Date.now() + Math.random()
          }))
        );
        setReferenceMaterials(
          [...sourceAssignment.referenceMaterials].map(m => ({
            ...m,
            id: 'rm' + Date.now() + Math.random()
          }))
        );
      }
    }
  }, [searchParams, getAssignmentById]);

  const handleSave = (publish: boolean) => {
    if (!title.trim() || !classId) return;

    const selectedClass = classes.find(c => c.id === classId);
    createAssignment({
      title: title.trim(),
      description: description.trim(),
      classId,
      className: selectedClass?.name || '',
      teacherId: currentUser?.id || 't1',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: publish ? 'published' : 'draft',
      totalScore,
      subject: subject || undefined,
      questions,
      referenceMaterials,
      totalStudents: selectedClass?.studentCount || 0
    });

    navigate('/teacher/assignments');
  };

  const addQuestion = () => {
    if (!newQuestion.content) return;
    
    const question: Question = {
      id: `q${Date.now()}`,
      type: newQuestion.type as QuestionType,
      content: newQuestion.content || '',
      score: newQuestion.score || 10,
      options: newQuestion.type === 'choice' || newQuestion.type === 'multi_choice' 
        ? (newQuestion.options?.filter(o => o.trim()) || [])
        : undefined,
      correctAnswer: newQuestion.correctAnswer,
      knowledgePoint: newQuestion.knowledgePoint
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      type: 'choice',
      content: '',
      score: 10,
      options: ['', '', '', '']
    });
    setShowQuestionModal(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  const getFileType = (fileName: string): 'pdf' | 'image' | 'doc' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
    return 'doc';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const material: ReferenceMaterial = {
          id: `rm${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          url: event.target?.result as string,
          type: getFileType(file.name),
          size: formatFileSize(file.size)
        };
        setReferenceMaterials(prev => [...prev, material]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddLink = () => {
    if (!linkName.trim() || !linkUrl.trim()) return;
    const material: ReferenceMaterial = {
      id: `rm${Date.now()}`,
      name: linkName.trim(),
      url: linkUrl.trim(),
      type: 'link'
    };
    setReferenceMaterials(prev => [...prev, material]);
    setLinkName('');
    setLinkUrl('');
    setShowLinkModal(false);
  };

  const openReferenceMaterial = (mat: ReferenceMaterial) => {
    if (mat.type === 'link' && mat.url !== '#') {
      window.open(mat.url, '_blank');
    } else if (mat.url.startsWith('data:')) {
      window.open(mat.url, '_blank');
    }
  };

  const removeReferenceMaterial = (id: string) => {
    setReferenceMaterials(referenceMaterials.filter(m => m.id !== id));
  };

  const questionTypeLabels: Record<QuestionType, string> = {
    choice: '单选题',
    multi_choice: '多选题',
    fill_blank: '填空题',
    short_answer: '简答题',
    essay: '作文题'
  };

  return (
    <Layout role="teacher">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/assignments')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">布置新作业</h1>
            <p className="text-neutral-500">填写作业信息，发布给学生</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-neutral-800 mb-4">基本信息</h3>
            <div className="space-y-4">
              <div>
                <label className="input-label">作业标题 <span className="text-danger-500">*</span></label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入作业标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">班级 <span className="text-danger-500">*</span></label>
                  <select
                    className="input"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="">请选择班级</option>
                    {myClasses.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">科目</label>
                  <select
                    className="input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">请选择科目</option>
                    <option value="语文">语文</option>
                    <option value="数学">数学</option>
                    <option value="英语">英语</option>
                    <option value="物理">物理</option>
                    <option value="化学">化学</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">截止时间</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">总分</label>
                  <input
                    type="number"
                    className="input"
                    value={totalScore}
                    onChange={(e) => setTotalScore(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">作业说明</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  placeholder="请输入作业说明、要求等..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800">题目设置</h3>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="btn-text text-sm"
              >
                <PlusCircle className="w-4 h-4 inline mr-1" />
                添加题目
              </button>
            </div>
            
            {questions.length === 0 ? (
              <div className="py-8 text-center text-neutral-400 border-2 border-dashed border-neutral-200 rounded-xl">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂未添加题目</p>
                <p className="text-xs mt-1">学生可以通过上传图片方式提交作业</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 bg-neutral-50 rounded-xl flex items-start justify-between"
                  >
                    <div className="flex gap-3">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-neutral">{questionTypeLabels[q.type]}</span>
                          <span className="text-sm text-neutral-500">{q.score}分</span>
                          {q.knowledgePoint && (
                            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                              {q.knowledgePoint}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700 text-sm">{q.content}</p>
                        {q.options && q.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt, i) => (
                              <p key={i} className="text-sm text-neutral-500">
                                {String.fromCharCode(65 + i)}. {opt}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="p-1.5 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800">参考资料</h3>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.txt"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-text text-sm"
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  上传文件
                </button>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="btn-text text-sm"
                >
                  <Link2 className="w-4 h-4 inline mr-1" />
                  添加链接
                </button>
              </div>
            </div>

            {referenceMaterials.length === 0 ? (
              <div className="py-6 text-center text-neutral-400 text-sm">
                暂无参考资料，可上传PDF、图片等辅助资料
              </div>
            ) : (
              <div className="space-y-2">
                {referenceMaterials.map(mat => (
                  <div
                    key={mat.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
                    onClick={() => openReferenceMaterial(mat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border border-neutral-200 flex items-center justify-center">
                        {mat.type === 'pdf' && <File className="w-5 h-5 text-danger-500" />}
                        {mat.type === 'image' && <File className="w-5 h-5 text-success-500" />}
                        {mat.type === 'doc' && <File className="w-5 h-5 text-primary-500" />}
                        {mat.type === 'link' && <Link2 className="w-5 h-5 text-accent-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">{mat.name}</p>
                        {mat.size && <p className="text-xs text-neutral-500">{mat.size}</p>}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeReferenceMaterial(mat.id);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-danger-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => navigate('/teacher/assignments')}
            className="btn btn-secondary"
          >
            取消
          </button>
          <button
            onClick={() => handleSave(false)}
            className="btn btn-secondary"
          >
            <Save className="w-4 h-4 mr-1.5" />
            保存草稿
          </button>
          <button
            onClick={() => handleSave(true)}
            className="btn btn-primary"
            disabled={!title.trim() || !classId}
          >
            <Send className="w-4 h-4 mr-1.5" />
            发布作业
          </button>
        </div>
      </div>

      {showQuestionModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowQuestionModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">添加题目</h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="input-label">题目类型</label>
                  <select
                    className="input"
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                  >
                    <option value="choice">单选题</option>
                    <option value="multi_choice">多选题</option>
                    <option value="fill_blank">填空题</option>
                    <option value="short_answer">简答题</option>
                    <option value="essay">作文题</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">题目内容</label>
                  <textarea
                    className="input min-h-[80px] resize-y"
                    placeholder="请输入题目内容"
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">分值</label>
                    <input
                      type="number"
                      className="input"
                      value={newQuestion.score}
                      onChange={(e) => setNewQuestion({ ...newQuestion, score: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="input-label">知识点</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="选填"
                      value={newQuestion.knowledgePoint || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, knowledgePoint: e.target.value })}
                    />
                  </div>
                </div>
                {(newQuestion.type === 'choice' || newQuestion.type === 'multi_choice') && (
                  <div>
                    <label className="input-label">选项</label>
                    <div className="space-y-2">
                      {(newQuestion.options || []).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-6 text-neutral-500 font-medium">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <input
                            type="text"
                            className="input flex-1"
                            placeholder={`选项${String.fromCharCode(65 + i)}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(newQuestion.options || [])];
                              newOptions[i] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={addQuestion}
                  className="btn btn-primary flex-1"
                  disabled={!newQuestion.content}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showLinkModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => { setShowLinkModal(false); setLinkName(''); setLinkUrl(''); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">添加链接</h3>
                <button
                  onClick={() => { setShowLinkModal(false); setLinkName(''); setLinkUrl(''); }}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="input-label">链接名称</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="例如：课程教材网站"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">链接地址</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="例如：https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowLinkModal(false); setLinkName(''); setLinkUrl(''); }}
                  className="btn btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleAddLink}
                  className="btn btn-primary flex-1"
                  disabled={!linkName.trim() || !linkUrl.trim()}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAssignmentById, getSubmissionsByAssignmentId, getStudentsByClassId } = useClassStore();
  const { addNotification } = useNotificationStore();

  const assignment = getAssignmentById(id || '');
  const submissions = getSubmissionsByAssignmentId(id || '');
  const students = getStudentsByClassId(assignment?.classId || '');

  if (!assignment) {
    return (
      <Layout role="teacher">
        <div className="text-center py-16">
          <p className="text-neutral-500">作业不存在</p>
          <button onClick={() => navigate('/teacher/assignments')} className="btn btn-primary mt-4">
            返回作业列表
          </button>
        </div>
      </Layout>
    );
  }

  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const pendingCount = submissions.filter(s => s.status === 'submitted').length;
  const notSubmittedCount = students.length - submissions.length;
  const submissionRate = students.length > 0 ? Math.round((submissions.length / students.length) * 100) : 0;

  const notSubmittedStudents = students.filter(
    s => !submissions.find(sub => sub.studentId === s.id)
  );

  return (
    <Layout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/assignments')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{assignment.title}</h1>
              <span className={`badge ${
                assignment.status === 'published' ? 'badge-success' : 
                assignment.status === 'draft' ? 'badge-neutral' : 'badge-primary'
              }`}>
                {assignment.status === 'published' ? '进行中' : 
                 assignment.status === 'draft' ? '草稿' : '已截止'}
              </span>
            </div>
            <p className="text-neutral-500 mt-1">{assignment.className}</p>
          </div>
          <button
            onClick={() => navigate(`/teacher/assignments/create?copy=${assignment.id}`)}
            className="btn btn-secondary"
          >
            <Copy className="w-4 h-4 mr-1.5" />
            复制
          </button>
          <button
            onClick={() => navigate(`/teacher/grading/${assignment.id}`)}
            className="btn btn-primary"
            disabled={pendingCount === 0}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            {pendingCount > 0 ? `批改作业 (${pendingCount})` : '查看批改'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="text-sm text-neutral-500">已提交</p>
            <p className="text-2xl font-bold text-success-600 mt-1">{submissions.length}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-neutral-500">待批改</p>
            <p className="text-2xl font-bold text-warning-600 mt-1">{pendingCount}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-neutral-500">已批改</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{gradedCount}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-neutral-500">提交率</p>
            <p className="text-2xl font-bold text-accent-600 mt-1">{submissionRate}%</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">作业详情</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    截止：{formatDate(assignment.dueDate)}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <FileText className="w-4 h-4" />
                    总分：{assignment.totalScore}分
                  </div>
                  {assignment.subject && (
                    <span className="badge badge-primary">{assignment.subject}</span>
                  )}
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-sm font-medium text-neutral-700 mb-2">作业说明</p>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {assignment.description}
                  </p>
                </div>
                {assignment.questions.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-sm font-medium text-neutral-700 mb-3">题目列表</p>
                    <div className="space-y-2">
                      {assignment.questions.map((q, i) => (
                        <div key={q.id} className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-primary-600">
                              第{i + 1}题
                            </span>
                            <span className="text-xs text-neutral-500">
                              ({q.score}分)
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700">{q.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {assignment.referenceMaterials.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-sm font-medium text-neutral-700 mb-3">参考资料</p>
                    <div className="space-y-2">
                      {assignment.referenceMaterials.map(mat => (
                        <div
                          key={mat.id}
                          className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-white rounded border border-neutral-200 flex items-center justify-center">
                            <File className="w-5 h-5 text-primary-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-700">{mat.name}</p>
                            {mat.size && <p className="text-xs text-neutral-500">{mat.size}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">提交情况</h3>
                <div className="flex gap-2">
                  <button className="btn-text text-sm">
                    <Users className="w-4 h-4 inline mr-1" />
                    全部学生
                  </button>
                </div>
              </div>
              <div className="divide-y divide-neutral-100">
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无学生提交</p>
                  </div>
                ) : (
                  submissions.map(sub => (
                    <div
                      key={sub.id}
                      className="p-4 hover:bg-neutral-50 cursor-pointer flex items-center gap-4"
                      onClick={() => navigate(`/teacher/grading/${assignment.id}/${sub.id}`)}
                    >
                      <img
                        src={sub.studentAvatar}
                        alt=""
                        className="w-10 h-10 rounded-full bg-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-800">{sub.studentName}</p>
                          {sub.status === 'graded' && (
                            <span className="badge badge-success">已批改</span>
                          )}
                          {sub.status === 'submitted' && (
                            <span className="badge badge-warning">待批改</span>
                          )}
                          {sub.isLate && (
                            <span className="badge badge-danger">迟交</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">
                          提交于 {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      {sub.score !== null && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">{sub.score}</p>
                          <p className="text-xs text-neutral-500">/{assignment.totalScore}</p>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-neutral-300" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">未提交学生</h3>
                <button
                  className="btn-text text-sm text-warning-600"
                  onClick={() => {
                    if (notSubmittedStudents.length === 0) return;
                    if (!window.confirm(`确认向 ${notSubmittedStudents.length} 位未提交学生发送催交提醒？`)) return;
                    notSubmittedStudents.forEach(student => {
                      addNotification({
                        userId: student.id,
                        userRole: 'student',
                        type: 'reminder',
                        title: '作业催交通知',
                        content: `${assignment.title}还未提交，请尽快完成并提交。`,
                        relatedId: assignment.id,
                        relatedType: 'assignment'
                      });
                    });
                    alert(`已向 ${notSubmittedStudents.length} 位学生发送催交提醒`);
                  }}
                >
                  一键催交
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {notSubmittedStudents.length === 0 ? (
                  <p className="text-center text-neutral-400 text-sm py-4">全部已提交</p>
                ) : (
                  notSubmittedStudents.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg"
                    >
                      <img
                        src={student.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full bg-neutral-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-700">{student.name}</p>
                        <p className="text-xs text-neutral-500">{student.studentNo}</p>
                      </div>
                      <button
                        className="text-xs text-warning-600 hover:text-warning-700"
                        onClick={() => {
                          addNotification({
                            userId: student.id,
                            userRole: 'student',
                            type: 'reminder',
                            title: '作业催交通知',
                            content: `${assignment.title}还未提交，请尽快完成并提交。`,
                            relatedId: assignment.id,
                            relatedType: 'assignment'
                          });
                          alert(`已向 ${student.name} 发送催交提醒`);
                        }}
                      >
                        催交
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">快捷操作</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full p-3 text-left text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  导出成绩报表
                </button>
                <button className="w-full p-3 text-left text-sm bg-success-50 text-success-700 rounded-lg hover:bg-success-100 transition-colors flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  发送作业提醒
                </button>
                <button className="w-full p-3 text-left text-sm bg-warning-50 text-warning-700 rounded-lg hover:bg-warning-100 transition-colors flex items-center gap-3">
                  <Trash2 className="w-5 h-5" />
                  删除作业
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { AssignmentList, AssignmentCreate, AssignmentDetail };
