import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDetail from './pages/BusinessDetail';
import BusinessList from './pages/BusinessList';
import CreateBusiness from './pages/CreateBusiness';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBusinesses from './pages/MyBusinesses';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import PendingApprovals from './pages/PendingApprovals';
import MyOrders from './pages/MyOrders';

function AdminLanding() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/products" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<BusinessList />} />
          <Route path="/products/:id" element={<BusinessDetail />} />

          <Route
            path="/products/new"
            element={
              <PrivateRoute>
                <CreateBusiness />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <PrivateRoute>
                <MyBusinesses />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending"
            element={
              <AdminRoute>
                <PendingApprovals />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />

          <Route path="/dashboard" element={<AdminLanding />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
