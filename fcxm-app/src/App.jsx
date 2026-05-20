import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import Question from './pages/Question/Question'
import Results from './pages/Results/Results'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/interview-prep" element={<InterviewPrep />} />
      <Route path="/question" element={<Question />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}
