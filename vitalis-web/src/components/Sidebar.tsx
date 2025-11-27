import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    Building2,
    LogOut,
    HeartPulse,
    FileText,
    Activity
} from 'lucide-react';

export function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const patientLinks = [
        { to: '/clinicas', icon: Building2, label: 'Buscar Clínicas' },
        { to: '/meus-agendamentos', icon: Calendar, label: 'Meus Agendamentos' },
        { to: '/prontuario', icon: FileText, label: 'Meu Prontuário' },
    ];

    const clinicLinks = [
        { to: '/gestao', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/clinicas', icon: Building2, label: 'Marketplace' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: Activity, label: 'Visão Geral' },
        { to: '/admin/tester', icon: Activity, label: 'Testar API' },
        { to: '/clinicas', icon: Building2, label: 'Ver Clínicas' },
    ];

    let links = patientLinks;
    if (user?.role === 'ROLE_CLINICA') links = clinicLinks;
    if (user?.role === 'ROLE_ADMIN') links = adminLinks;

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col shadow-soft z-50">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2 rounded-lg">
                        <HeartPulse className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">Vitalis</h1>
                        <p className="text-xs text-slate-500 font-medium">Saúde Integrada</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary-50 text-primary-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <link.icon className={`w-5 h-5 transition-colors ${window.location.pathname === link.to ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                            }`} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="mb-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-400 font-medium mb-1">Logado como</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.sub || 'Usuário'}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                        {user?.role === 'ROLE_PACIENTE' ? 'Paciente' : user?.role === 'ROLE_CLINICA' ? 'Clínica' : 'Admin'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da conta</span>
                </button>
            </div>
        </div>
    );
}
