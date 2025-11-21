import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MedicalRecordModal } from '../components/MedicalRecordModal';
import { RatingModal } from '../components/RatingModal';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { Calendar, Clock, FileText, Star, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Appointment {
    id: number;
    clinicaNomeFantasia: string;
    dataHora: string;
    status: string;
    valorTotal: number;
    procedimentos: Array<{ nome: string }>;
    prontuario?: {
        descricaoSintomas: string;
        diagnostico: string;
        prescricaoMedica: string;
        dataRegistro: string;
    };
}

const statusConfig = {
    PENDENTE: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    REALIZADO: { label: 'Realizado', color: 'bg-green-100 text-green-700 border-green-200' },
    CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function MeusAgendamentos() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [ratingAppointment, setRatingAppointment] = useState<Appointment | null>(null);
    const { toasts, removeToast, success, error } = useToast();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/agendamentos/paciente');
            setAppointments(response.data);
        } catch (err) {
            console.error('Error loading appointments:', err);
            error('Erro ao carregar agendamentos');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSuccess = () => {
        success('Avaliação enviada com sucesso!');
        loadAppointments();
    };

    return (
        <DashboardLayout
            title="Meus Agendamentos"
            subtitle="Acompanhe o histórico de suas consultas e procedimentos"
        >
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-20">
                    <Calendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-600 text-lg">Você ainda não tem agendamentos.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => {
                        const status = statusConfig[appointment.status as keyof typeof statusConfig];
                        return (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-xl border border-secondary-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                            {appointment.clinicaNomeFantasia}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {appointment.procedimentos.map((proc, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                                >
                                                    {proc.nome}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-secondary-600">
                                        <Calendar className="w-5 h-5" />
                                        <span>{new Date(appointment.dataHora).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary-600">
                                        <Clock className="w-5 h-5" />
                                        <span>{new Date(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="text-secondary-900 font-semibold">
                                        R$ {appointment.valorTotal.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-secondary-200">
                                    {appointment.prontuario && (
                                        <button
                                            onClick={() => setSelectedRecord(appointment.prontuario)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Ver Prontuário
                                        </button>
                                    )}
                                    {appointment.status === 'REALIZADO' && (
                                        <button
                                            onClick={() => setRatingAppointment(appointment)}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                                        >
                                            <Star className="w-4 h-4" />
                                            Avaliar
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <MedicalRecordModal
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                record={selectedRecord}
            />

            {ratingAppointment && (
                <RatingModal
                    isOpen={!!ratingAppointment}
                    onClose={() => setRatingAppointment(null)}
                    appointmentId={ratingAppointment.id}
                    clinicName={ratingAppointment.clinicaNomeFantasia}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </DashboardLayout>
    );
}
