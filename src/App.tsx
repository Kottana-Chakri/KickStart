import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TaskCreator from './components/TaskCreator';
import StudySession from './components/StudySession';
import { SupabaseProvider } from './contexts/SupabaseContext';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-task" element={<TaskCreator />} />
            <Route path="/study/:taskId" element={<StudySession />} />
          </Routes>
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;