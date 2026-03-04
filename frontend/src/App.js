import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import UserDashboard from './pages/UserDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobForm from './pages/JobForm';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/jobs" element={<JobList user={user} />} />
        <Route path="/jobs/:id" element={<JobDetails user={user} />} />
        <Route path="/profile" element={
          user?.role === 'user' ? <Profile /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          user?.role === 'user' ? <UserDashboard /> : 
          user?.role === 'recruiter' ? <RecruiterDashboard /> : 
          <Navigate to="/login" />
        } />
        <Route path="/post-job" element={
          user?.role === 'recruiter' ? <JobForm /> : <Navigate to="/login" />
        } />
        <Route path="/edit-job/:id" element={
          user?.role === 'recruiter' ? <JobForm /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/jobs" />} />
      </Routes>
    </Router>
  );
}

export default App;
