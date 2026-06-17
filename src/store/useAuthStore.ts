import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Teacher, Student, Parent, UserRole } from '@/types';
import { mockTeachers, mockStudents, mockParents } from '@/mock';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, id: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  getTeacherById: (id: string) => Teacher | undefined;
  getStudentById: (id: string) => Student | undefined;
  getParentById: (id: string) => Parent | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      
      login: (role: UserRole, id: string) => {
        let user: User | null = null;
        if (role === 'teacher') {
          user = mockTeachers.find(t => t.id === id) || mockTeachers[0];
        } else if (role === 'student') {
          user = mockStudents.find(s => s.id === id) || mockStudents[0];
        } else if (role === 'parent') {
          user = mockParents.find(p => p.id === id) || mockParents[0];
        }
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
        }
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      switchRole: (role: UserRole) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        let user: User | null = null;
        if (role === 'teacher') {
          user = mockTeachers[0];
        } else if (role === 'student') {
          user = mockStudents[0];
        } else if (role === 'parent') {
          user = mockParents[0];
        }
        if (user) {
          set({ currentUser: user });
        }
      },
      
      getTeacherById: (id: string) => mockTeachers.find(t => t.id === id),
      getStudentById: (id: string) => mockStudents.find(s => s.id === id),
      getParentById: (id: string) => mockParents.find(p => p.id === id),
    }),
    {
      name: 'auth-storage',
    }
  )
);
