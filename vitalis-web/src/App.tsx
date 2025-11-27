import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Clinicas } from './pages/Clinicas';
import { MeusAgendamentos } from './pages/MeusAgendamentos';
import { Gestao } from './pages/Gestao';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { RequestTester } from './pages/RequestTester';
import { ProntuarioPaciente } from './pages/ProntuarioPaciente';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
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
            path="/prontuario"
            element={
              <PrivateRoute allowedRoles={['ROLE_PACIENTE']}>
                <ProntuarioPaciente />
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
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tester"
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
                <RequestTester />
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

