import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CareerRecommendations from "./pages/CareerRecommendations";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import ResumeReview from "./pages/ResumeReview";
import InterviewPractice from "./pages/InterviewPractice";
import JobRecommendations from "./pages/JobRecommendations";
import ProgressTracker from "./pages/ProgressTracker";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/careers" element={<ProtectedRoute><CareerRecommendations /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeReview /></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><InterviewPractice /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobRecommendations /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
