import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Login from "@/pages/login/Login";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import { ClassList, ClassDetail } from "@/pages/teacher/ClassManagement";
import { AssignmentList, AssignmentCreate, AssignmentDetail } from "@/pages/teacher/AssignmentManagement";
import { GradingList, GradingDetail } from "@/pages/teacher/Grading";
import Statistics from "@/pages/teacher/Statistics";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentAssignmentDetail from "@/pages/student/StudentAssignmentDetail";
import ParentDashboard from "@/pages/parent/ParentDashboard";

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) => {
  const { isAuthenticated, currentUser } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const { isAuthenticated, currentUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/') {
      if (currentUser?.role === 'teacher') {
        window.location.href = '/teacher/dashboard';
      } else if (currentUser?.role === 'student') {
        window.location.href = '/student/dashboard';
      } else if (currentUser?.role === 'parent') {
        window.location.href = '/parent/dashboard';
      }
    }
  }, [isAuthenticated, currentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/classes" element={
          <ProtectedRoute allowedRole="teacher">
            <ClassList />
          </ProtectedRoute>
        } />
        <Route path="/teacher/classes/:id" element={
          <ProtectedRoute allowedRole="teacher">
            <ClassDetail />
          </ProtectedRoute>
        } />
        <Route path="/teacher/assignments" element={
          <ProtectedRoute allowedRole="teacher">
            <AssignmentList />
          </ProtectedRoute>
        } />
        <Route path="/teacher/assignments/create" element={
          <ProtectedRoute allowedRole="teacher">
            <AssignmentCreate />
          </ProtectedRoute>
        } />
        <Route path="/teacher/assignments/:id" element={
          <ProtectedRoute allowedRole="teacher">
            <AssignmentDetail />
          </ProtectedRoute>
        } />
        <Route path="/teacher/grading" element={
          <ProtectedRoute allowedRole="teacher">
            <GradingList />
          </ProtectedRoute>
        } />
        <Route path="/teacher/grading/:assignmentId" element={
          <ProtectedRoute allowedRole="teacher">
            <GradingDetail />
          </ProtectedRoute>
        } />
        <Route path="/teacher/grading/:assignmentId/:submissionId" element={
          <ProtectedRoute allowedRole="teacher">
            <GradingDetail />
          </ProtectedRoute>
        } />
        <Route path="/teacher/statistics" element={
          <ProtectedRoute allowedRole="teacher">
            <Statistics />
          </ProtectedRoute>
        } />
        <Route path="/teacher/settings" element={
          <ProtectedRoute allowedRole="teacher">
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
              <p className="text-neutral-500">系统设置页 - 开发中</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments/:id" element={
          <ProtectedRoute allowedRole="student">
            <StudentAssignmentDetail />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments/:id/result" element={
          <ProtectedRoute allowedRole="student">
            <StudentAssignmentDetail />
          </ProtectedRoute>
        } />
        <Route path="/student/report" element={
          <ProtectedRoute allowedRole="student">
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
              <p className="text-neutral-500">学习报告 - 开发中</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/parent/dashboard" element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parent/assignments" element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parent/report" element={
          <ProtectedRoute allowedRole="parent">
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
              <p className="text-neutral-500">成绩分析 - 开发中</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
