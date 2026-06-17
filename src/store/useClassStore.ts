import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Class, StudentInClass, Assignment, Submission, Question, ReferenceMaterial, Statistics } from '@/types';
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
  joinClassByInviteCode: (inviteCode: string, student: StudentInClass) => Class | null;
  getStudentClassIds: (studentId: string) => string[];
  
  getAssignmentsByClassId: (classId: string) => Assignment[];
  getAssignmentById: (id: string) => Assignment | undefined;
  getAssignmentsByTeacherId: (teacherId: string) => Assignment[];
  getAssignmentsByClassIds: (classIds: string[]) => Assignment[];
  createAssignment: (data: Partial<Assignment>) => Assignment;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  getSubmissionsByAssignmentId: (assignmentId: string) => Submission[];
  getSubmissionById: (id: string) => Submission | undefined;
  getSubmissionsByStudentId: (studentId: string) => Submission[];
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, data: Partial<Submission>) => void;
  gradeSubmission: (id: string, score: number, comment: string, annotations: any[]) => void;
  
  computeAssignmentStats: (assignmentId: string) => Statistics;
  getNotSubmittedStudents: (assignmentId: string) => StudentInClass[];
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
          if (students.some(s => s.id === student.id)) return state;
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

      joinClassByInviteCode: (inviteCode: string, student: StudentInClass) => {
        const cls = get().classes.find(c => c.inviteCode.toUpperCase() === inviteCode.toUpperCase());
        if (!cls) return null;
        
        const existingStudents = get().classStudents[cls.id] || [];
        if (existingStudents.some(s => s.id === student.id)) return cls;
        
        set(state => ({
          classStudents: { 
            ...state.classStudents, 
            [cls.id]: [...(state.classStudents[cls.id] || []), student] 
          },
          classes: state.classes.map(c => 
            c.id === cls.id ? { ...c, studentCount: c.studentCount + 1 } : c
          )
        }));
        
        return cls;
      },

      getStudentClassIds: (studentId: string) => {
        const { classStudents } = get();
        return Object.entries(classStudents)
          .filter(([, students]) => students.some(s => s.id === studentId))
          .map(([classId]) => classId);
      },
      
      getAssignmentsByClassId: (classId: string) => 
        get().assignments.filter(a => a.classId === classId),
      
      getAssignmentById: (id: string) => get().assignments.find(a => a.id === id),
      
      getAssignmentsByTeacherId: (teacherId: string) =>
        get().assignments.filter(a => a.teacherId === teacherId),

      getAssignmentsByClassIds: (classIds: string[]) =>
        get().assignments.filter(a => classIds.includes(a.classId)),
      
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
        set(state => {
          const assignment = state.assignments.find(a => a.id === submission.assignmentId);
          const alreadySubmitted = state.submissions.some(
            s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
          );
          const newSubmissionCount = alreadySubmitted 
            ? assignment?.submissionCount || 0
            : (assignment?.submissionCount || 0) + 1;
          
          return {
            submissions: [...state.submissions, submission],
            assignments: state.assignments.map(a => 
              a.id === submission.assignmentId ? { ...a, submissionCount: newSubmissionCount } : a
            )
          };
        });
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

      getNotSubmittedStudents: (assignmentId: string) => {
        const assignment = get().getAssignmentById(assignmentId);
        if (!assignment) return [];
        const submitted = get().getSubmissionsByAssignmentId(assignmentId);
        const submittedIds = submitted.map(s => s.studentId);
        const classStudents = get().getStudentsByClassId(assignment.classId);
        return classStudents.filter(s => !submittedIds.includes(s.id));
      },

      computeAssignmentStats: (assignmentId: string) => {
        const assignment = get().getAssignmentById(assignmentId);
        if (!assignment) {
          return {
            assignmentId,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            submissionRate: 0,
            totalStudents: 0,
            submittedCount: 0,
            gradedCount: 0,
            scoreDistribution: [],
            knowledgePointStats: []
          };
        }

        const submissions = get().getSubmissionsByAssignmentId(assignmentId);
        const graded = submissions.filter(s => s.status === 'graded' && s.score !== null);
        const totalStudents = assignment.totalStudents || get().getStudentsByClassId(assignment.classId).length;
        
        const scores = graded.map(s => s.score!);
        const averageScore = scores.length > 0 
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 
          : 0;
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
        const submissionRate = totalStudents > 0 ? submissions.length / totalStudents : 0;

        const ranges = [
          { range: '90-100', min: 90, max: 100 },
          { range: '80-89', min: 80, max: 89 },
          { range: '70-79', min: 70, max: 79 },
          { range: '60-69', min: 60, max: 69 },
          { range: '0-59', min: 0, max: 59 }
        ];
        const scoreDistribution = ranges.map(r => ({
          range: r.range,
          count: scores.filter(s => s >= r.min && s <= r.max).length
        }));

        const knowledgePointMap: Record<string, { correct: number; total: number; errorCount: number }> = {};
        graded.forEach(sub => {
          sub.answers.forEach(answer => {
            const question = assignment.questions.find(q => q.id === answer.questionId);
            if (question?.knowledgePoint) {
              const kp = question.knowledgePoint;
              if (!knowledgePointMap[kp]) {
                knowledgePointMap[kp] = { correct: 0, total: 0, errorCount: 0 };
              }
              knowledgePointMap[kp].total += 1;
              if (answer.isCorrect) {
                knowledgePointMap[kp].correct += 1;
              } else {
                knowledgePointMap[kp].errorCount += 1;
              }
            }
          });
        });

        const knowledgePointStats = Object.entries(knowledgePointMap).map(([name, data]) => ({
          name,
          accuracy: data.total > 0 ? Math.round(data.correct / data.total * 100) / 100 : 0,
          errorCount: data.errorCount
        }));

        return {
          assignmentId,
          averageScore,
          highestScore,
          lowestScore,
          submissionRate,
          totalStudents,
          submittedCount: submissions.length,
          gradedCount: graded.length,
          scoreDistribution,
          knowledgePointStats
        };
      },
    }),
    {
      name: 'class-storage',
    }
  )
);
