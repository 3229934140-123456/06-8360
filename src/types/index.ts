export type UserRole = 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
  phone?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  subject?: string;
}

export interface Student extends User {
  role: 'student';
  studentNo: string;
  classId: string;
  className: string;
}

export interface Parent extends User {
  role: 'parent';
  childIds: string[];
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  inviteCode: string;
  studentCount: number;
  grade?: string;
  createdAt: string;
}

export interface StudentInClass {
  id: string;
  name: string;
  studentNo: string;
  avatar: string;
  joinDate: string;
}

export interface ReferenceMaterial {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'link';
  size?: string;
}

export type QuestionType = 'choice' | 'multi_choice' | 'fill_blank' | 'short_answer' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  score: number;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  knowledgePoint?: string;
}

export type AssignmentStatus = 'draft' | 'published' | 'closed';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  teacherId: string;
  dueDate: string;
  createdAt: string;
  status: AssignmentStatus;
  totalScore: number;
  referenceMaterials: ReferenceMaterial[];
  questions: Question[];
  submissionCount: number;
  totalStudents: number;
  subject?: string;
}

export type SubmissionStatus = 'not_submitted' | 'submitted' | 'graded' | 'late' | 'returned';

export interface Answer {
  questionId: string;
  answer: string | string[];
  score?: number;
  isCorrect?: boolean;
}

export interface Annotation {
  id: string;
  type: 'pen' | 'text' | 'rect' | 'highlight';
  pageIndex: number;
  color: string;
  strokeWidth?: number;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentNo: string;
  images: string[];
  answers: Answer[];
  submittedAt: string;
  status: SubmissionStatus;
  score: number | null;
  comment: string;
  gradedAt: string | null;
  gradedBy?: string;
  annotations: Annotation[];
  isLate: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  userRole: UserRole;
  type: 'assignment_published' | 'assignment_graded' | 'reminder' | 'system';
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: string;
  read: boolean;
  createdAt: string;
}

export interface Statistics {
  assignmentId: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  submissionRate: number;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  knowledgePointStats: {
    name: string;
    accuracy: number;
    errorCount: number;
  }[];
}

export interface StudentAssignmentStats {
  studentId: string;
  totalAssignments: number;
  completedCount: number;
  averageScore: number;
  submissionRate: number;
  recentScores: {
    assignmentId: string;
    title: string;
    score: number;
    totalScore: number;
    date: string;
  }[];
}
