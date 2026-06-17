import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Bell
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useClassStore } from '@/store/useClassStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { formatDate, getDaysRemaining, isOverdue } from '@/utils';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { assignments, getSubmissionsByStudentId } = useClassStore();
  const { getUnreadCount, getNotificationsByUser } = useNotificationStore();

  const studentId = currentUser?.id || 's1';
  const submissions = getSubmissionsByStudentId(studentId);
  const notifications = getNotificationsByUser(studentId, 'student');
  const unreadCount = getUnreadCount(studentId, 'student');

  const pendingAssignments = assignments.filter(a => {
    const submitted = submissions.find(s => s.assignmentId === a.id);
    return !submitted && a.status === 'published';
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const completedAssignments = assignments.filter(a => {
    const submitted = submissions.find(s => s.assignmentId === a.id);
    return submitted;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const gradedAssignments = submissions.filter(s => s.status === 'graded');
  const averageScore = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((sum, s) => sum + (s.score || 0), 0) / gradedAssignments.length)
    : 0;

  const statsCards = [
    {
      label: '待完成',
      value: pendingAssignments.length,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      label: '已完成',
      value: completedAssignments.length,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      label: '平均分',
      value: averageScore,
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: '未读通知',
      value: unreadCount,
      icon: Bell,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    }
  ];

  const urgentAssignments = pendingAssignments.filter(a => {
    const daysRemaining = getDaysRemaining(a.dueDate);
    return daysRemaining <= 2 && daysRemaining >= 0;
  });

  return (
    <Layout role="student">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt=""
              className="w-16 h-16 rounded-full border-4 border-white/30"
            />
            <div>
              <h1 className="text-2xl font-bold">你好，{currentUser?.name}！</h1>
              <p className="text-white/80 mt-1">今天也要加油完成作业哦 💪</p>
            </div>
          </div>
          {urgentAssignments.length > 0 && (
            <div className="mt-6 p-4 bg-white/15 rounded-xl backdrop-blur-sm">
              <p className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                你有 {urgentAssignments.length} 份作业即将截止
              </p>
              <p className="text-xs text-white/80 mt-1">
                {urgentAssignments.map(a => a.title).join('、')}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
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
                <div>
                  <h3 className="font-semibold text-neutral-800">待完成作业</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    共 {pendingAssignments.length} 份作业待完成
                  </p>
                </div>
                <button
                  onClick={() => navigate('/student/assignments')}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  全部作业 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {pendingAssignments.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success-300" />
                    <p>太棒了，没有待完成的作业！</p>
                  </div>
                ) : (
                  pendingAssignments.slice(0, 3).map(assignment => {
                    const daysRemaining = getDaysRemaining(assignment.dueDate);
                    const isUrgent = daysRemaining <= 2;
                    
                    return (
                      <div
                        key={assignment.id}
                        className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors"
                        onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-800 truncate">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-neutral-500 mt-1">
                              {assignment.className}
                            </p>
                          </div>
                          <span className={`badge ml-3 ${
                            isUrgent ? 'badge-warning' : 'badge-primary'
                          }`}>
                            {daysRemaining < 0 ? '已截止' : 
                             daysRemaining === 0 ? '今天截止' : 
                             `还剩${daysRemaining}天`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            截止：{formatDate(assignment.dueDate)}
                          </span>
                          {assignment.questions.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {assignment.questions.length} 道题
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">最近批改</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {gradedAssignments.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无批改记录</p>
                  </div>
                ) : (
                  gradedAssignments.slice(0, 3).map(sub => (
                    <div
                      key={sub.id}
                      className="p-4 hover:bg-neutral-50 cursor-pointer flex items-center gap-4"
                      onClick={() => navigate(`/student/assignments/${sub.assignmentId}/result`)}
                    >
                      <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 truncate">
                          {sub.assignmentTitle}
                        </p>
                        <p className="text-sm text-neutral-500">
                          批改于 {formatDate(sub.gradedAt || '')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">{sub.score}</p>
                        <p className="text-xs text-neutral-500">分</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-300" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">最近通知</h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-neutral-400 text-sm py-4">暂无通知</p>
                ) : (
                  notifications.slice(0, 5).map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg ${
                        notif.read ? 'bg-neutral-50' : 'bg-primary-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-neutral-800">
                            {notif.title}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {notif.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">学习概览</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">完成率</span>
                  <span className="text-sm font-medium text-neutral-800">
                    {assignments.length > 0 
                      ? Math.round((completedAssignments.length / assignments.length) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full"
                    style={{ 
                      width: `${assignments.length > 0 
                        ? (completedAssignments.length / assignments.length) * 100 
                        : 0}%` 
                    }}
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">平均分趋势</span>
                    <TrendingUp className="w-4 h-4 text-success-500" />
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[60, 65, 70, 68, 75, 78, averageScore].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary-100 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
