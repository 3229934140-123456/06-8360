import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileText,
  Award,
  Target,
  AlertTriangle,
  ChevronDown,
  Filter
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockTrendData, mockStatistics, mockAssignments } from '@/mock';
import { useClassStore } from '@/store/useClassStore';

const Statistics = () => {
  const { classes, getAssignmentsByTeacherId } = useClassStore();
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState('a1');

  const myClasses = classes.filter(c => c.teacherId === 't1');
  const assignments = getAssignmentsByTeacherId('t1');
  const currentAssignment = assignments.find(a => a.id === selectedAssignment) || mockAssignments[0];

  const scoreDistributionData = mockStatistics.scoreDistribution.map(item => ({
    ...item,
    人数: item.count
  }));

  const knowledgePointData = mockStatistics.knowledgePointStats.map(item => ({
    ...item,
    正确率: Math.round(item.accuracy * 100)
  }));

  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statsCards = [
    {
      label: '班级平均分',
      value: mockStatistics.averageScore,
      unit: '分',
      icon: TrendingUp,
      color: 'bg-primary-500',
      trend: '+3.2分',
      trendUp: true
    },
    {
      label: '作业提交率',
      value: Math.round(mockStatistics.submissionRate * 100),
      unit: '%',
      icon: Target,
      color: 'bg-success-500',
      trend: '+5%',
      trendUp: true
    },
    {
      label: '最高分',
      value: mockStatistics.highestScore,
      unit: '分',
      icon: Award,
      color: 'bg-accent-500',
      trend: '持平',
      trendUp: null
    },
    {
      label: '待提升学生',
      value: 2,
      unit: '人',
      icon: AlertTriangle,
      color: 'bg-warning-500',
      trend: '-1人',
      trendUp: false
    }
  ];

  const errorKnowledgePoints = mockStatistics.knowledgePointStats
    .filter(k => k.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <Layout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">统计分析</h1>
            <p className="text-neutral-500 mt-1">班级学情数据一目了然</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer"
              >
                <option value="all">全部班级</option>
                {myClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer"
              >
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-neutral-800">{stat.value}</span>
                      <span className="text-sm text-neutral-500">{stat.unit}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <span className={`text-xs font-medium ${
                    stat.trendUp === true ? 'text-success-600' :
                    stat.trendUp === false ? 'text-danger-600' : 'text-neutral-500'
                  }`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-neutral-400 ml-2">较上次</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">成绩趋势</h3>
              <p className="text-sm text-neutral-500 mt-1">近8周班级平均分变化</p>
            </div>
            <div className="p-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="平均分"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="提交率"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">分数分布</h3>
              <p className="text-sm text-neutral-500 mt-1">{currentAssignment?.title}</p>
            </div>
            <div className="p-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="人数"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">知识点掌握度</h3>
              <p className="text-sm text-neutral-500 mt-1">各知识点正确率分析</p>
            </div>
            <div className="p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={knowledgePointData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, '正确率']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="正确率" radius={[4, 4, 0, 0]}>
                    {knowledgePointData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.正确率 >= 80 ? '#22C55E' : entry.正确率 >= 60 ? '#F59E0B' : '#EF4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">能力雷达图</h3>
              <p className="text-sm text-neutral-500 mt-1">综合能力评估</p>
            </div>
            <div className="p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={knowledgePointData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="正确率"
                    dataKey="正确率"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">错误集中点</h3>
              <p className="text-sm text-neutral-500 mt-1">需要重点讲解的知识点</p>
            </div>
            <div className="p-6">
              {errorKnowledgePoints.length === 0 ? (
                <div className="text-center py-8 text-success-500">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p>全部知识点掌握良好！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {errorKnowledgePoints.map((point, index) => (
                    <div key={point.name} className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-danger-500' : 
                        index === 1 ? 'bg-warning-500' : 'bg-accent-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-700">{point.name}</span>
                          <span className={`text-sm font-bold ${
                            point.accuracy < 0.5 ? 'text-danger-600' : 'text-warning-600'
                          }`}>
                            {Math.round(point.accuracy * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              point.accuracy < 0.5 ? 'bg-danger-500' : 'bg-warning-500'
                            }`}
                            style={{ width: `${point.accuracy * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          错误 {point.errorCount} 人次
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-neutral-800">学生排名</h3>
              <p className="text-sm text-neutral-500 mt-1">本次作业成绩排名</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                { rank: 1, name: '赵六', score: 59, total: 60, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4' },
                { rank: 2, name: '张三', score: 58, total: 60, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1' },
                { rank: 3, name: '王五', score: 45, total: 60, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3' },
                { rank: 4, name: '李四', score: 13, total: 60, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2' },
              ].map(student => (
                <div
                  key={student.rank}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    student.rank === 1 ? 'bg-yellow-400 text-white' :
                    student.rank === 2 ? 'bg-neutral-400 text-white' :
                    student.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-neutral-200 text-neutral-600'
                  }`}>
                    {student.rank}
                  </span>
                  <img
                    src={student.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full bg-neutral-200"
                  />
                  <span className="flex-1 font-medium text-neutral-700 text-sm">
                    {student.name}
                  </span>
                  <span className="font-bold text-primary-600">
                    {student.score}
                    <span className="text-sm font-normal text-neutral-400">/{student.total}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
