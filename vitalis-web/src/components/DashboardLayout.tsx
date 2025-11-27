import { useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <div className="ml-64">
                {/* Header */}
                <div className="bg-white border-b border-secondary-200 sticky top-0 z-10 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            {title && <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>}
                            {subtitle && <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>}
                        </div>

                        {/* User Profile Section */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated && user ? (
                                <div className="flex items-center gap-3 pl-6 border-l border-secondary-200">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-secondary-900">{user.sub}</p>
                                        <p className="text-xs text-secondary-500">
                                            {user.role === 'ROLE_PACIENTE' ? 'Paciente' : user.role === 'ROLE_CLINICA' ? 'Clínica' : 'Admin'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-secondary-400 hover:text-red-600 transition-colors"
                                        title="Sair"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Entrar</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
