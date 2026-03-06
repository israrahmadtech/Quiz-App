import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuizList from './pages/QuizList.jsx';
import QuizStart from './pages/QuizStart.jsx';
import QuizPlay from './pages/QuizPlay.jsx';
import QuizResult from './pages/QuizResult.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import History from './pages/History.jsx';
import AdminQuizzes from './pages/admin/AdminQuizzes.jsx';
import AdminQuizForm from './pages/admin/AdminQuizForm.jsx';
import AdminQuestions from './pages/admin/AdminQuestions.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route element={<Layout />}>
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quizzes"    element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
        <Route path="/quiz/:id"   element={<ProtectedRoute><QuizStart /></ProtectedRoute>} />
        <Route path="/quiz/:id/play" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
        <Route path="/quiz/:id/result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        <Route path="/quiz/:id/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/history"  element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/admin"           element={<AdminRoute><AdminQuizzes /></AdminRoute>} />
        <Route path="/admin/quiz/new"  element={<AdminRoute><AdminQuizForm /></AdminRoute>} />
        <Route path="/admin/quiz/:id/edit" element={<AdminRoute><AdminQuizForm /></AdminRoute>} />
        <Route path="/admin/quiz/:id/questions" element={<AdminRoute><AdminQuestions /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
