import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Clinicas } from './pages/Clinicas';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/clinicas" element={<Clinicas />} />
          <Route path="/" element={<Navigate to="/clinicas" replace />} />
          <Route path="/dashboard" element={<div>Dashboard (Em construção)</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
