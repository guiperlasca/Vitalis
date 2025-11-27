import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { AttendanceForm } from '../components/AttendanceForm';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import {
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Stethoscope,
    Loader2,
    Clock
} from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Appointment {
    id: number;
    pacienteNome: string;
    dataHora: string;
    status: string;
    valorTotal: number;
    procedimentos: Array<{ nome: string }>;
}

const statusConfig = {
    PENDENTE: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
    REALIZADO: { label: 'Realizado', color: 'bg-green-100 text-green-700' },
    CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

export function Gestao() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [attendanceAppointment, setAttendanceAppointment] = useState<Appointment | null>(null);
    const { toasts, removeToast, success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            // TODO: Use correct endpoint based on user role. For now, using patient endpoint as default.
            // If this fails (e.g. 403), we might want to try another endpoint or handle it.
            const response = await api.get('/agendamentos/paciente');
            setAppointments(response.data);
        } catch (err) {
            console.error('Error loading appointments:', err);
            // error('Erro ao carregar agendamentos'); // Suppress error for now to avoid spam on load if empty
        } finally {
            setLoading(false);
        }
    };

    const handleSeedDatabase = async () => {
        try {
            setLoading(true);
            await api.post('/admin/seed');
            success('Banco de dados populado com sucesso!');
            // After seeding, try to login as the seeded patient to see data? 
            // Or just reload if we are already logged in.
            loadAppointments();
        } catch (err) {
            console.error('Error seeding database:', err);
            error('Erro ao popular banco de dados');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/agendamentos/${id}/status?novoStatus=${newStatus}`);
            success(`Agendamento ${newStatus.toLowerCase()} com sucesso!`);
            loadAppointments();
        } catch (err) {
            error('Erro ao atualizar status do agendamento');
        }
    };

    const handleAttendanceSuccess = () => {
        success('Prontuário registrado com sucesso!');
        loadAppointments();
    };

    const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dataHora);
        const today = new Date();
        return aptDate.toDateString() === today.toDateString();
    });

    const totalRevenue = appointments
        .filter(apt => apt.status === 'REALIZADO')
        .reduce((sum, apt) => sum + apt.valorTotal, 0);

    return (
        <DashboardLayout
            title="Dashboard de Gestão"
            subtitle="Gerencie seus agendamentos e acompanhe métricas"
        >
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 text-sm font-medium">Faturamento Total</p>
                            <p className="text-3xl font-bold mt-2">R$ {totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Agendamentos Hoje</p>
                            <p className="text-3xl font-bold mt-2">{todayAppointments.length}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-xl border border-secondary-200 shadow-sm">
                <div className="p-6 border-b border-secondary-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-secondary-900">Agendamentos</h2>
                        <button
                            onClick={handleSeedDatabase}
                            className="px-4 py-2 bg-secondary-800 text-white rounded-lg hover:bg-secondary-900 transition-colors text-sm font-medium"
                        >
                            Popular Banco de Dados
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-20">
                        <Calendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                        <p className="text-secondary-600 text-lg">Nenhum agendamento encontrado.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-secondary-200">
                        {appointments.map((appointment) => {
                            const status = statusConfig[appointment.status as keyof typeof statusConfig];
                            return (
                                <div key={appointment.id} className="p-6 hover:bg-secondary-50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                                {appointment.pacienteNome}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {appointment.procedimentos.map((proc, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                                                    >
                                                        {proc.nome}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 mb-4 text-sm text-secondary-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(appointment.dataHora).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="font-semibold text-secondary-900">
                                            R$ {appointment.valorTotal.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {appointment.status === 'PENDENTE' && (
                                            <button
                                                onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMADO')}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Aceitar
                                            </button>
                                        )}
                                        {appointment.status === 'CONFIRMADO' && (
                                            <button
                                                onClick={() => setAttendanceAppointment(appointment)}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                                            >
                                                <Stethoscope className="w-4 h-4" />
                                                Atender
                                            </button>
                                        )}
                                        {(appointment.status === 'PENDENTE' || appointment.status === 'CONFIRMADO') && (
                                            <button
                                                onClick={() => handleStatusUpdate(appointment.id, 'CANCELADO')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {attendanceAppointment && (
                <AttendanceForm
                    isOpen={!!attendanceAppointment}
                    onClose={() => setAttendanceAppointment(null)}
                    appointmentId={attendanceAppointment.id}
                    patientName={attendanceAppointment.pacienteNome}
                    onSuccess={handleAttendanceSuccess}
                />
            )}
        </DashboardLayout>
    );
}
