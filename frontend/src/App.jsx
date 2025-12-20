import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/AuthContext";
import { UserProvider } from "./modules/user/User";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import NavBar from "./shared/components/NavBar";

// Lazy Load Pages for Performance Optimization
const Login = lazy(() => import("./modules/auth/Login"));
const Signup = lazy(() => import("./modules/auth/Signup"));
const AdminDashboard = lazy(() => import("./modules/admin/AdminDashboard"));
const CreateQuiz = lazy(() => import("./modules/admin/CreateQuiz"));
const QuizLeaderboard = lazy(() => import("./modules/admin/QuizLeaderboard"));
const MainPage = lazy(() => import("./modules/mainpage/MainPage"));
const Start = lazy(() => import("./modules/start/Start"));
const Quiz = lazy(() => import("./modules/quiz/Quiz"));
const QuizAccess = lazy(() => import("./modules/quiz/QuizAccess"));
const Result = lazy(() => import("./modules/result/Result").then(module => ({ default: module.Result })));
const About = lazy(() => import("./shared/components/About"));
const Contact = lazy(() => import("./shared/components/Contact"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavBar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Quiz Access (requires auth) */}
            <Route path="/quiz/access/:link" element={<QuizAccess />} />
            <Route
              path="/quiz/take/:link"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />

            {/* Legacy Routes (for backward compatibility) */}
            <Route path="/start" element={<Start />} />
            <Route path="/quiz/:category" element={<Quiz />} />
            <Route path="/result" element={<Result />} />

            {/* Admin Routes (require admin role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-quiz"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leaderboard/:id"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <QuizLeaderboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
