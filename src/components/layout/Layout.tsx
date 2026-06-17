import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/utils';
import type { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

const teacherMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '工作台', path: '/teacher/dashboard' },
  { icon: Users, label: '班级管理', path: '/teacher/classes' },
  { icon: FileText, label: '作业管理', path: '/teacher/assignments' },
  { icon: BarChart3, label: '统计分析', path: '/teacher/statistics' },
  { icon: Settings, label: '系统设置', path: '/teacher/settings' },
];

const studentMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '作业大厅', path: '/student/dashboard' },
  { icon: FileText, label: '我的作业', path: '/student/assignments' },
  { icon: BarChart3, label: '学习报告', path: '/student/report' },
];

const parentMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '学习总览', path: '/parent/dashboard' },
  { icon: FileText, label: '作业记录', path: '/parent/assignments' },
  { icon: BarChart3, label: '成绩分析', path: '/parent/report' },
];

const Sidebar = ({ role, isOpen, onClose }: { role: UserRole; isOpen: boolean; onClose: () => void }) => {
  const menuItems = role === 'teacher' ? teacherMenuItems : role === 'student' ? studentMenuItems : parentMenuItems;
  const roleLabel = role === 'teacher' ? '老师端' : role === 'student' ? '学生端' : '家长端';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-neutral-100">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-neutral-800 text-base">作业批改系统</h1>
            <span className="text-xs text-neutral-500">{roleLabel}</span>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-400 text-center">v1.0.0</div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ role, onMenuClick }: { role: UserRole; onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const unreadCount = useNotificationStore(state => 
    state.getUnreadCount(currentUser?.id || '', role)
  );
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleNames = {
    teacher: '老师',
    student: '学生',
    parent: '家长'
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-neutral-500 hover:text-neutral-700"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-neutral-800 hidden sm:block">
          {roleNames[role]}工作台
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <img
              src={currentUser?.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full bg-neutral-200"
            />
            <span className="text-sm font-medium text-neutral-700 hidden sm:block">
              {currentUser?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-neutral-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card-hover border border-neutral-100 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-800">{currentUser?.name}</p>
                  <p className="text-xs text-neutral-500">{roleNames[role]}账号</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children, role }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header role={role} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
