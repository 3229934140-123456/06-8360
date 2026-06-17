import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  ChevronRight,
  Plus,
  Bell,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useClassStore } from '@/store/useClassStore';
import { formatDate, formatRelativeTime } from '@/utils';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { classes, assignments, getAssignmentsByTeacherId, getSubmissionsByAssignmentId } = useClassStore();

  const teacherAssignments = getAssignmentsByTeacherId(currentUser?.id || 't1');
  
  const pendingGradingCount = teacherAssignments.reduce((sum, assignment) => {
    const submissions = getSubmissionsByAssignmentId(assignment.id);
    const ungraded = submissions.filter(s => s.status === 'submitted').length;
    return sum + ungraded;
  }, 0);

  const totalStudents = classes.filter(c => c.teacherId === currentUser?.id)
    .reduce((sum, c) => sum + c.studentCount, 0);

  const recentAssignments = [...teacherAssignments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const stats = [
    {
      label: '待批改作业',
      value: pendingGradingCount,
      icon: FileText,
      color: 'bg-warning-100 text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      label: '我的班级',
      value: classes.filter(c => c.teacherId === currentUser?.id).length,
      icon: Users,
      color: 'bg-primary-100 text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: '学生总数',
      value: totalStudents,
      icon: Award,
      color: 'bg-success-100 text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      label: '已发布作业',
      value: teacherAssignments.filter(a => a.status === 'published').length,
      icon: CheckCircle,
      color: 'bg-accent-100 text-accent-600',
      bgColor: 'bg-accent-50'
    }
  ];

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id || 't1').slice(0, 3);

  return (
    <Layout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              早上好，{currentUser?.name}
            </h1>
            <p className="text-neutral-500 mt-1">今天是 {formatDate(new Date().toISOString())}，祝您工作顺利！</p>
          </div>
          <button
            onClick={() => navigate('/teacher/assignments/create')}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            布置作业
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">最近作业</h3>
                <button
                  onClick={() => navigate('/teacher/assignments')}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {recentAssignments.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无作业</p>
                  </div>
                ) : (
                  recentAssignments.map(assignment => {
                    const submissions = getSubmissionsByAssignmentId(assignment.id);
                    const ungradedCount = submissions.filter(s => s.status === 'submitted').length;
                    const gradedCount = submissions.filter(s => s.status === 'graded').length;
                    
                    return (
                      <div
                        key={assignment.id}
                        className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/teacher/assignments/${assignment.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-800 truncate">{assignment.title}</h4>
                            <p className="text-sm text-neutral-500 mt-1">{assignment.className}</p>
                          </div>
                          <span className={`badge ml-3 ${
                            assignment.status === 'published' ? 'badge-success' : 
                            assignment.status === 'draft' ? 'badge-neutral' : 'badge-primary'
                          }`}>
                            {assignment.status === 'published' ? '进行中' : 
                             assignment.status === 'draft' ? '草稿' : '已截止'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center text-neutral-500">
                            <Users className="w-4 h-4 mr-1" />
                            {assignment.submissionCount}/{assignment.totalStudents} 已提交
                          </span>
                          <span className="flex items-center text-neutral-500">
                            <Clock className="w-4 h-4 mr-1" />
                            截止 {formatDate(assignment.dueDate)}
                          </span>
                          {ungradedCount > 0 && (
                            <span className="text-warning-600 font-medium">
                              {ungradedCount} 份待批
                            </span>
                          )}
                        </div>
                        {assignment.totalStudents > 0 && (
                          <div className="mt-3">
                            <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full transition-all"
                                style={{ width: `${(gradedCount / assignment.totalStudents) * 100}%` }}
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

            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">待办事项</h3>
              </div>
              <div className="p-6 space-y-3">
                {pendingGradingCount > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-warning-50 rounded-lg">
                    <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-warning-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">待批改作业</p>
                      <p className="text-xs text-neutral-500">共有 {pendingGradingCount} 份作业等待批改</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">系统通知</p>
                    <p className="text-xs text-neutral-500">您有 3 条未读通知</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-success-50 rounded-lg">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">本周学情报告</p>
                    <p className="text-xs text-neutral-500">班级平均成绩较上周提升 3.2 分</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">我的班级</h3>
                <button
                  onClick={() => navigate('/teacher/classes')}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  管理 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {myClasses.map(cls => (
                  <div
                    key={cls.id}
                    className="p-3 border border-neutral-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-800">{cls.name}</h4>
                        <p className="text-sm text-neutral-500">{cls.studentCount} 名学生</p>
                      </div>
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/teacher/classes')}
                  className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 text-sm hover:border-primary-300 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  创建新班级
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">快捷操作</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/teacher/assignments/create')}
                  className="p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors text-center"
                >
                  <Plus className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-primary-700">布置作业</span>
                </button>
                <button
                  onClick={() => navigate('/teacher/grading')}
                  className="p-4 bg-success-50 rounded-xl hover:bg-success-100 transition-colors text-center"
                >
                  <FileText className="w-6 h-6 text-success-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-success-700">批改作业</span>
                </button>
                <button
                  onClick={() => navigate('/teacher/statistics')}
                  className="p-4 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors text-center"
                >
                  <BarChart3 className="w-6 h-6 text-accent-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-accent-700">数据统计</span>
                </button>
                <button
                  onClick={() => navigate('/teacher/classes')}
                  className="p-4 bg-warning-50 rounded-xl hover:bg-warning-100 transition-colors text-center"
                >
                  <Users className="w-6 h-6 text-warning-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-warning-700">班级管理</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
