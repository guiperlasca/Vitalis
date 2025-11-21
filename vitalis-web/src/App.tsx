import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Clinicas } from './pages/Clinicas';
import { MeusAgendamentos } from './pages/MeusAgendamentos';
import { Gestao } from './pages/Gestao';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/clinicas" element={<Clinicas />} />
          <Route
            path="/meus-agendamentos"
            element={
              <PrivateRoute allowedRoles={['ROLE_PACIENTE']}>
                <MeusAgendamentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/gestao"
            element={
              <PrivateRoute allowedRoles={['ROLE_CLINICA']}>
                <Gestao />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/clinicas" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
