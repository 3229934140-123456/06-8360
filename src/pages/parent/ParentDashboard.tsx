import { useState } from 'react';
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Bell,
  ChevronRight,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useClassStore } from '@/store/useClassStore';
import { mockStudentStats, mockTrendData } from '@/mock';
import { formatDate, getScoreColor } from '@/utils';

const ParentDashboard = () => {
  const { currentUser } = useAuthStore();
  const { getSubmissionsByStudentId } = useClassStore();
  const [selectedChild, setSelectedChild] = useState('s1');

  const children = [
    { id: 's1', name: '张三', className: '三年级一班', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1' }
  ];

  const currentChild = children.find(c => c.id === selectedChild) || children[0];
  const submissions = getSubmissionsByStudentId(selectedChild);
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const [unsubmittedCount, setUnsubmittedCount] = useState(3);

  const scoreDistributionData = [
    { name: '优秀', value: 2, color: '#22C55E' },
    { name: '良好', value: 1, color: '#3B82F6' },
    { name: '中等', value: 0, color: '#F59E0B' },
    { name: '待提高', value: 1, color: '#EF4444' }
  ];

  const recentScores = [
    { date: '12/10', 得分: 84, 总分: 100 },
    { date: '12/15', 得分: 94, 总分: 100 },
    { date: '12/19', 得分: 97, 总分: 100 },
    { date: '12/21', 得分: 85, 总分: 100 },
  ];

  const statsCards = [
    {
      label: '已完成作业',
      value: mockStudentStats.completedCount,
      total: mockStudentStats.totalAssignments,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      label: '平均分',
      value: mockStudentStats.averageScore,
      unit: '分',
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: '提交率',
      value: Math.round(mockStudentStats.submissionRate * 100),
      unit: '%',
      icon: TrendingUp,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      label: '待完成',
      value: unsubmittedCount,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    }
  ];

  return (
    <Layout role="parent">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              欢迎您，{currentUser?.name}
            </h1>
            <p className="text-neutral-500 mt-1">查看孩子的学习情况</p>
          </div>
          <div className="flex gap-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  selectedChild === child.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <img
                  src={child.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full bg-neutral-200"
                />
                <span className="text-sm font-medium">{child.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <img
              src={currentChild.avatar}
              alt=""
              className="w-16 h-16 rounded-full border-4 border-white/30"
            />
            <div>
              <h2 className="text-xl font-bold">{currentChild.name}</h2>
              <p className="text-white/80">{currentChild.className}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-white/80 text-sm">本周学习状态</p>
              <p className="text-2xl font-bold">良好</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </span>
                      {stat.total && (
                        <span className="text-sm text-neutral-400">/{stat.total}</span>
                      )}
                      {stat.unit && (
                        <span className="text-sm text-neutral-500">{stat.unit}</span>
                      )}
                    </div>
                  </div>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">成绩趋势</h3>
                <p className="text-sm text-neutral-500 mt-1">近期作业成绩变化</p>
              </div>
              <div className="p-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="得分"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">最近作业</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-neutral-100">
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无作业记录</p>
                  </div>
                ) : (
                  submissions.slice(0, 4).map(sub => (
                    <div key={sub.id} className="p-4 hover:bg-neutral-50 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sub.status === 'graded' ? 'bg-success-100' : 'bg-warning-100'
                      }`}>
                        {sub.status === 'graded' ? (
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 truncate">
                          {sub.assignmentTitle}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {sub.status === 'graded' 
                            ? `批改于 ${formatDate(sub.gradedAt || '')}` 
                            : `提交于 ${formatDate(sub.submittedAt)}`}
                        </p>
                      </div>
                      {sub.status === 'graded' && sub.score !== null && (
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(sub.score, 100)}`}>
                            {sub.score}
                          </p>
                          <p className="text-xs text-neutral-400">分</p>
                        </div>
                      )}
                      {sub.status === 'submitted' && (
                        <span className="badge badge-warning">待批改</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">待完成作业</h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {unsubmittedCount === 0 ? (
                  <p className="text-center text-neutral-400 text-sm py-4">全部已完成</p>
                ) : (
                  Array(unsubmittedCount).fill(null).map((_, i) => (
                    <div key={i} className="p-3 bg-warning-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800 truncate">
                            待完成作业 {i + 1}
                          </p>
                          <p className="text-xs text-neutral-500">请提醒孩子完成</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">成绩分布</h3>
              </div>
              <div className="p-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="px-6 pb-4 grid grid-cols-2 gap-2">
                {scoreDistributionData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-neutral-600">
                      {item.name}: {item.value}次
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-neutral-800">最近通知</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm font-medium text-neutral-800">作业已批改</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    第三章练习已批改，得分：58/60
                  </p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm font-medium text-neutral-800">新作业发布</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    周长专项练习已发布
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParentDashboard;
