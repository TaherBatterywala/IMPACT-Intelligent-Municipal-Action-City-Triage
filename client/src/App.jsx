import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComplaintProvider } from './context/ComplaintContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OfficerLogin from './pages/auth/OfficerLogin';
import UserDashboard from './pages/user/UserDashboard';
import FileComplaint from './pages/user/FileComplaint';
import TrackStatus from './pages/user/TrackStatus';
import TrafficChallan from './pages/user/TrafficChallan';
import BusTickets from './pages/user/BusTickets';
import KnowYourWard from './pages/user/KnowYourWard';
import Emergency from './pages/user/Emergency';
import UserProfile from './pages/user/UserProfile';
import OfficerDashboard from './pages/officer/OfficerDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role && user.role !== 'admin') {
    // Simple check, officer role is 'officer' in DB but sometimes we check 'officer' string
    // In User model role is 'citizen' or 'admin'. In Officer model role is 'officer'.
    // My auth middleware handles mapping both to req.user.
    // On frontend, user object has role.
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
        <ComplaintProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/officer/login" element={<OfficerLogin />} />

            {/* User Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={<Navigate to="/" />} />
            <Route path="/file-complaint" element={
              <PrivateRoute><FileComplaint /></PrivateRoute>
            } />
            <Route path="/status" element={
              <PrivateRoute><TrackStatus /></PrivateRoute>
            } />
            <Route path="/challan" element={
              <PrivateRoute><TrafficChallan /></PrivateRoute>
            } />
            <Route path="/bus" element={
              <PrivateRoute><BusTickets /></PrivateRoute>
            } />
            <Route path="/ward" element={
              <PrivateRoute><KnowYourWard /></PrivateRoute>
            } />
            <Route path="/emergency" element={
              <PrivateRoute><Emergency /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><UserProfile /></PrivateRoute>
            } />

            {/* Officer Routes */}
            <Route path="/officer/dashboard" element={
              <PrivateRoute role="officer">
                <OfficerDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </ComplaintProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
