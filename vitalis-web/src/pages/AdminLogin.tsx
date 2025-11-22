import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Zap } from 'lucide-react';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, senha });
            const payload = JSON.parse(atob(response.data.token.split('.')[1]));

            if (payload.role !== 'ROLE_ADMIN') {
                setError('Acesso negado. Apenas administradores podem acessar esta área.');
                setLoading(false);
                return;
            }

            login(response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais de administrador.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Tech Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-electric-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-cyber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-96 h-96 bg-neon-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 items-center justify-center relative z-10 p-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-white text-center max-w-lg"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8"
                    >
                        <div className="relative inline-block">
                            <Shield size={160} className="text-electric-400 drop-shadow-2xl" />
                            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white animate-pulse-glow" />
                        </div>
                    </motion.div>

                    <h1 className="text-6xl font-bold mb-6 tracking-tight">
                        <span className="gradient-text-cyber">Admin Portal</span>
                    </h1>
                    <p className="text-xl text-white/80 leading-relaxed">
                        Sistema de gestão avançada para administradores. Controle total sobre requisições e operações do Vitalis.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-electric-500 animate-pulse-glow"></div>
                        <div className="w-3 h-3 rounded-full bg-cyber-500 animate-pulse-glow animation-delay-2000"></div>
                        <div className="w-3 h-3 rounded-full bg-neon-500 animate-pulse-glow animation-delay-4000"></div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card-dark rounded-3xl p-10 shadow-2xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <Shield className="w-16 h-16 text-electric-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                        </div>

                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-4xl font-bold text-white mb-2">Acesso Restrito</h2>
                            <p className="text-lg text-white/70">Apenas para administradores</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                                    Email Administrativo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-white/50" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none rounded-xl relative block w-full pl-12 pr-4 py-4 border-2 border-white/20 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent transition-all duration-200 hover:border-white/30 bg-white/10 backdrop-blur-sm"
                                        placeholder="admin@vitalis.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="senha" className="block text-sm font-semibold text-white/90 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-white/50" />
                                    </div>
                                    <input
                                        id="senha"
                                        name="senha"
                                        type="password"
                                        required
                                        className="appearance-none rounded-xl relative block w-full pl-12 pr-4 py-4 border-2 border-white/20 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent transition-all duration-200 hover:border-white/30 bg-white/10 backdrop-blur-sm"
                                        placeholder="••••••••"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-xl backdrop-blur-sm"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{error}</span>
                                </motion.div>
                            )}

                            <div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-electric-600 to-cyber-600 hover:from-electric-700 hover:to-cyber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-500 transition-all duration-200 shadow-electric hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Autenticando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Acessar Dashboard</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="text-center text-sm text-white/50 mt-6 font-mono">
                            <p>Credenciais de teste:</p>
                            <p className="bg-white/5 p-2 rounded mt-2 border border-white/10">
                                admin@vitalis.com / admin123
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
