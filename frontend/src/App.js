import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { GalaxyBackground } from "./components/GalaxyBackground";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import CareerDetail from "./pages/CareerDetail";
import LearningPath from "./pages/LearningPath";
import CareersPage from "./pages/CareersPage";
import Profile from "./pages/Profile";
import ExamsPage from "./pages/ExamsPage";
import CollegesPage from "./pages/CollegesPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <GalaxyBackground>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
                <Route path="/career/:careerId" element={<ProtectedRoute><CareerDetail /></ProtectedRoute>} />
                <Route path="/learning-path/:careerId" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
                <Route path="/careers" element={<ProtectedRoute><CareersPage /></ProtectedRoute>} />
                <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
                <Route path="/colleges" element={<ProtectedRoute><CollegesPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-center" richColors />
            </GalaxyBackground>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
