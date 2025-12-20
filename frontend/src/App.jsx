import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/AuthContext";
import { UserProvider } from "./modules/user/User";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";

// Auth Pages
import Login from "./modules/auth/Login";
import Signup from "./modules/auth/Signup";

// Admin Pages
import AdminDashboard from "./modules/admin/AdminDashboard";
import CreateQuiz from "./modules/admin/CreateQuiz";
import QuizLeaderboard from "./modules/admin/QuizLeaderboard";

// Student/Public Pages
import MainPage from "./modules/mainpage/MainPage";
import Start from "./modules/start/Start";
import Quiz from "./modules/quiz/Quiz";
import QuizAccess from "./modules/quiz/QuizAccess";
import { Result } from "./modules/result/Result";

// Shared Components
import NavBar from "./shared/components/NavBar";
import About from "./shared/components/About";
import Contact from "./shared/components/Contact";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavBar />
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
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
