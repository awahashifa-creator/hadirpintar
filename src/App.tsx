import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import StudentAttendance from './pages/StudentAttendance';
import Recap from './pages/Recap';
import StudentData from './pages/StudentData';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/app" />;

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* App Routes */}
          <Route path="/app" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/app/absensi-guru" element={<PrivateRoute><TeacherAttendance /></PrivateRoute>} />
          <Route path="/app/absensi-siswa" element={<PrivateRoute><StudentAttendance /></PrivateRoute>} />
          <Route path="/app/rekap-guru" element={<PrivateRoute adminOnly><Recap type="guru" /></PrivateRoute>} />
          <Route path="/app/rekap-siswa" element={<PrivateRoute><Recap type="siswa" /></PrivateRoute>} />
          <Route path="/app/data-siswa" element={<PrivateRoute adminOnly><StudentData /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
