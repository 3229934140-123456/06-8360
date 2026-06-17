import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Class, StudentInClass, Assignment, Submission, Question, ReferenceMaterial } from '@/types';
import { mockClasses, mockClassStudents, mockAssignments, mockSubmissions } from '@/mock';

interface ClassState {
  classes: Class[];
  classStudents: Record<string, StudentInClass[]>;
  assignments: Assignment[];
  submissions: Submission[];
  
  getClassById: (id: string) => Class | undefined;
  getStudentsByClassId: (classId: string) => StudentInClass[];
  
  createClass: (name: string, teacherId: string, teacherName: string) => Class;
  addStudentToClass: (classId: string, student: StudentInClass) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
  
  getAssignmentsByClassId: (classId: string) => Assignment[];
  getAssignmentById: (id: string) => Assignment | undefined;
  createAssignment: (data: Partial<Assignment>) => Assignment;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  getSubmissionsByAssignmentId: (assignmentId: string) => Submission[];
  getSubmissionById: (id: string) => Submission | undefined;
  getSubmissionsByStudentId: (studentId: string) => Submission[];
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, data: Partial<Submission>) => void;
  gradeSubmission: (id: string, score: number, comment: string, annotations: any[]) => void;
  
  getAssignmentsByTeacherId: (teacherId: string) => Assignment[];
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: mockClasses,
      classStudents: mockClassStudents,
      assignments: mockAssignments,
      submissions: mockSubmissions,
      
      getClassById: (id: string) => get().classes.find(c => c.id === id),
      
      getStudentsByClassId: (classId: string) => get().classStudents[classId] || [],
      
      createClass: (name: string, teacherId: string, teacherName: string) => {
        const newClass: Class = {
          id: `c${Date.now()}`,
          name,
          teacherId,
          teacherName,
          inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          studentCount: 0,
          createdAt: new Date().toISOString()
        };
        set(state => ({
          classes: [...state.classes, newClass],
          classStudents: { ...state.classStudents, [newClass.id]: [] }
        }));
        return newClass;
      },
      
      addStudentToClass: (classId: string, student: StudentInClass) => {
        set(state => {
          const students = state.classStudents[classId] || [];
          return {
            classStudents: { ...state.classStudents, [classId]: [...students, student] },
            classes: state.classes.map(c => 
              c.id === classId ? { ...c, studentCount: c.studentCount + 1 } : c
            )
          };
        });
      },
      
      removeStudentFromClass: (classId: string, studentId: string) => {
        set(state => {
          const students = (state.classStudents[classId] || []).filter(s => s.id !== studentId);
          return {
            classStudents: { ...state.classStudents, [classId]: students },
            classes: state.classes.map(c => 
              c.id === classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c
            )
          };
        });
      },
      
      getAssignmentsByClassId: (classId: string) => 
        get().assignments.filter(a => a.classId === classId),
      
      getAssignmentById: (id: string) => get().assignments.find(a => a.id === id),
      
      createAssignment: (data: Partial<Assignment>) => {
        const newAssignment: Assignment = {
          id: `a${Date.now()}`,
          title: data.title || '新作业',
          description: data.description || '',
          classId: data.classId || '',
          className: data.className || '',
          teacherId: data.teacherId || '',
          dueDate: data.dueDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: data.status || 'draft',
          totalScore: data.totalScore || 100,
          referenceMaterials: data.referenceMaterials || [],
          questions: data.questions || [],
          submissionCount: 0,
          totalStudents: data.totalStudents || 0,
          subject: data.subject
        };
        set(state => ({ assignments: [...state.assignments, newAssignment] }));
        return newAssignment;
      },
      
      updateAssignment: (id: string, data: Partial<Assignment>) => {
        set(state => ({
          assignments: state.assignments.map(a => 
            a.id === id ? { ...a, ...data } : a
          )
        }));
      },
      
      deleteAssignment: (id: string) => {
        set(state => ({
          assignments: state.assignments.filter(a => a.id !== id)
        }));
      },
      
      getSubmissionsByAssignmentId: (assignmentId: string) =>
        get().submissions.filter(s => s.assignmentId === assignmentId),
      
      getSubmissionById: (id: string) => get().submissions.find(s => s.id === id),
      
      getSubmissionsByStudentId: (studentId: string) =>
        get().submissions.filter(s => s.studentId === studentId),
      
      addSubmission: (submission: Submission) => {
        set(state => ({ submissions: [...state.submissions, submission] }));
      },
      
      updateSubmission: (id: string, data: Partial<Submission>) => {
        set(state => ({
          submissions: state.submissions.map(s =>
            s.id === id ? { ...s, ...data } : s
          )
        }));
      },
      
      gradeSubmission: (id: string, score: number, comment: string, annotations: any[]) => {
        set(state => ({
          submissions: state.submissions.map(s =>
            s.id === id ? {
              ...s,
              score,
              comment,
              annotations,
              status: 'graded',
              gradedAt: new Date().toISOString(),
              gradedBy: '王明老师'
            } : s
          )
        }));
      },
      
      getAssignmentsByTeacherId: (teacherId: string) =>
        get().assignments.filter(a => a.teacherId === teacherId),
    }),
    {
      name: 'class-storage',
    }
  )
);
