import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    Building2,
    LogOut,
    HeartPulse,
    ClipboardList
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
    ];

    const clinicLinks = [
        { to: '/gestao', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/clinicas', icon: Building2, label: 'Marketplace' },
    ];

    const links = user?.role === 'ROLE_PACIENTE' ? patientLinks : clinicLinks;

    return (
        <div className="w-64 bg-secondary-900 text-white h-screen fixed left-0 top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-secondary-700">
                <div className="flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-primary-400" />
                    <div>
                        <h1 className="text-xl font-bold">Vitalis</h1>
                        <p className="text-xs text-secondary-400">Health Marketplace</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-secondary-700">
                <div className="mb-3 px-4 py-2 bg-secondary-800 rounded-lg">
                    <p className="text-xs text-secondary-400">Logado como</p>
                    <p className="text-sm font-semibold truncate">{user?.sub}</p>
                    <p className="text-xs text-primary-400">
                        {user?.role === 'ROLE_PACIENTE' ? 'Paciente' : 'Clínica'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-300 hover:bg-red-600 hover:text-white transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </div>
    );
}
