import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [activeRole, setActiveRole] = useState<UserRole>('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { value: 'teacher', label: '老师', icon: BookOpen, description: '布置作业、批改、统计' },
    { value: 'student', label: '学生', icon: GraduationCap, description: '提交作业、查看批改' },
    { value: 'parent', label: '家长', icon: Users, description: '查看孩子学习情况' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(activeRole, activeRole === 'teacher' ? 't1' : activeRole === 'student' ? 's1' : 'p1');
    
    if (activeRole === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (activeRole === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/parent/dashboard');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setActiveRole(role);
    login(role, role === 'teacher' ? 't1' : role === 'student' ? 's1' : 'p1');
    
    if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/parent/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 左侧品牌区域 */}
          <div className="hidden md:block">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-800">作业批改系统</h1>
              </div>
              <p className="text-neutral-500 text-lg">
                高效的在线作业布置与批改平台，助力K12教育数字化
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent-200 rounded-full opacity-50 blur-2xl"></div>
              
              <div className="relative bg-white rounded-2xl p-6 shadow-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">在线图片批改</p>
                      <p className="text-sm text-neutral-500">直接在作业图片上标注批改</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">学情数据分析</p>
                      <p className="text-sm text-neutral-500">自动统计班级成绩趋势</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">智能提醒通知</p>
                      <p className="text-sm text-neutral-500">作业催交、批改提醒一键发送</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧登录表单 */}
          <div className="bg-white rounded-2xl shadow-card p-8 animate-fade-in">
            <div className="md:hidden mb-6 text-center">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-800">作业批改系统</h1>
            </div>

            <h2 className="text-xl font-semibold text-neutral-800 mb-6">欢迎登录</h2>

            {/* 角色切换 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map(role => {
                const Icon = role.icon;
                const isActive = activeRole === role.value;
                return (
                  <button
                    key={role.value}
                    onClick={() => setActiveRole(role.value as UserRole)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <p className={`text-sm font-medium ${isActive ? 'text-primary-600' : 'text-neutral-600'}`}>
                      {role.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">账号</label>
                <input
                  type="text"
                  className="input"
                  placeholder={`请输入${roles.find(r => r.value === activeRole)?.label}账号`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">密码</label>
                <input
                  type="password"
                  className="input"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                  记住密码
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700">忘记密码？</a>
              </div>
              <button type="submit" className="btn btn-primary w-full py-2.5">
                <LogIn className="w-4 h-4 mr-2" />
                登录
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-neutral-500">快速体验</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickLogin('teacher')}
                  className="text-xs py-2 px-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  老师演示
                </button>
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="text-xs py-2 px-3 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 transition-colors"
                >
                  学生演示
                </button>
                <button
                  onClick={() => handleQuickLogin('parent')}
                  className="text-xs py-2 px-3 bg-accent-50 text-accent-600 rounded-lg hover:bg-accent-100 transition-colors"
                >
                  家长演示
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-neutral-400 text-sm mt-8">
          © 2024 作业批改系统 · 助力教育数字化
        </p>
      </div>
    </div>
  );
};

export default Login;
