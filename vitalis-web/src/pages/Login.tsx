import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { HeartPulse, Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, senha });
      login(response.data.token);
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 opacity-90"></div>
        <div className="relative z-10 text-white text-center p-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <HeartPulse size={120} className="mx-auto mb-8 text-primary-200" />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Vitalis</h1>
            <p className="text-xl text-primary-100 max-w-md mx-auto">
              Gestão de saúde inteligente e humanizada. Conectando pacientes e profissionais.
            </p>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-secondary-900">Bem-vindo de volta</h2>
            <p className="mt-2 text-secondary-500">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-secondary-200 placeholder-secondary-400 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Seu email profissional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="senha" className="sr-only">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-secondary-200 placeholder-secondary-400 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Sua senha segura"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 p-2 rounded"
              >
                {error}
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight className="h-5 w-5 text-primary-500 group-hover:text-primary-400 transition-colors" />
                </span>
                Entrar na Plataforma
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
