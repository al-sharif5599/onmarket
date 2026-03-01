import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BusinessList from './pages/BusinessList';
import BusinessDetail from './pages/BusinessDetail';
import CreateBusiness from './pages/CreateBusiness';
import MyBusinesses from './pages/MyBusinesses';
import AdminDashboard from './pages/AdminDashboard';
import PendingApprovals from './pages/PendingApprovals';
import UserManagement from './pages/UserManagement';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/businesses" element={<BusinessList />} />
            <Route path="/businesses/:id" element={<BusinessDetail />} />
            
            {/* Protected Routes - Customer */}
            <Route path="/create-business" element={
              <PrivateRoute>
                <CreateBusiness />
              </PrivateRoute>
            } />
            <Route path="/my-businesses" element={
              <PrivateRoute>
                <MyBusinesses />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/pending" element={
              <AdminRoute>
                <PendingApprovals />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
