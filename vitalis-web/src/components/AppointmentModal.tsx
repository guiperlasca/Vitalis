import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

interface Procedure {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracaoEstimadaMinutos: number;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: number;
    clinicName: string;
    onSuccess: () => void;
}

export function AppointmentModal({ isOpen, onClose, clinicId, clinicName, onSuccess }: AppointmentModalProps) {
    const [step, setStep] = useState(1);
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [selectedProcedures, setSelectedProcedures] = useState<number[]>([]);
    const [dateTime, setDateTime] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingProcedures, setLoadingProcedures] = useState(true);

    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const { error } = useToast();

    useEffect(() => {
        if (isOpen) {
            loadProcedures();
        }
    }, [isOpen, clinicId]);

    const loadProcedures = async () => {
        try {
            setLoadingProcedures(true);
            const response = await api.get(`/clinicas/${clinicId}/procedimentos`);
            setProcedures(response.data);
        } catch (error) {
            console.error('Error loading procedures:', error);
        } finally {
            setLoadingProcedures(false);
        }
    };

    const toggleProcedure = (id: number) => {
        setSelectedProcedures(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const totalValue = procedures
        .filter(p => selectedProcedures.includes(p.id))
        .reduce((sum, p) => sum + p.preco, 0);

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            error('Você precisa estar logado para agendar uma consulta.');
            onClose();
            navigate('/login');
            return;
        }

        if (selectedProcedures.length === 0 || !dateTime) return;

        try {
            setLoading(true);
            const payload = {
                clinicaId: clinicId,
                procedimentoIds: selectedProcedures,
                dataHora: dateTime,
                observacoes
            };
            console.log('Sending appointment payload:', payload);

            await api.post('/agendamentos', payload);

            onSuccess();
            handleClose();
            navigate('/meus-agendamentos');
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                if (err.response.data.errors) {
                    error(err.response.data.errors.map((e: any) => e.defaultMessage).join(', '));
                } else {
                    error(err.response.data.message || 'Erro ao agendar consulta.');
                }
            } else {
                error('Erro ao agendar consulta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setSelectedProcedures([]);
        setDateTime('');
        setObservacoes('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Agendar Consulta</h2>
                                <p className="text-primary-100 mt-1">{clinicName}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'}`}>
                                    1
                                </div>
                                <span className="text-sm font-medium">Procedimentos</span>
                            </div>
                            <div className="flex-1 h-1 bg-primary-500 rounded" />
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'}`}>
                                    2
                                </div>
                                <span className="text-sm font-medium">Data e Hora</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                        {step === 1 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-900 mb-4">
                                    Selecione os procedimentos desejados:
                                </h3>
                                {loadingProcedures ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                                    </div>
                                ) : (
                                    procedures.map(procedure => (
                                        <label
                                            key={procedure.id}
                                            className="flex items-start gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedProcedures.includes(procedure.id)}
                                                onChange={() => toggleProcedure(procedure.id)}
                                                className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-secondary-900">{procedure.nome}</h4>
                                                    <span className="text-primary-600 font-semibold">
                                                        R$ {procedure.preco.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-secondary-600 mt-1">{procedure.descricao}</p>
                                                <p className="text-xs text-secondary-500 mt-1">
                                                    Duração estimada: {procedure.duracaoEstimadaMinutos} min
                                                </p>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Data e Hora
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dateTime}
                                        onChange={(e) => setDateTime(e.target.value)}
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Alguma informação adicional..."
                                    />
                                </div>

                                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-6">
                                    <h4 className="font-semibold text-secondary-900 mb-2">Resumo do Agendamento</h4>
                                    <div className="space-y-1 text-sm text-secondary-700">
                                        {procedures
                                            .filter(p => selectedProcedures.includes(p.id))
                                            .map(p => (
                                                <div key={p.id} className="flex justify-between">
                                                    <span>{p.nome}</span>
                                                    <span>R$ {p.preco.toFixed(2)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-secondary-200 p-6 bg-secondary-50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-secondary-900">
                                <DollarSign className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium">Valor Total:</span>
                                <span className="text-2xl font-bold text-primary-600">
                                    R$ {totalValue.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {step === 2 && (
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors font-medium"
                                >
                                    Voltar
                                </button>
                            )}
                            <button
                                onClick={step === 1 ? () => setStep(2) : handleSubmit}
                                disabled={step === 1 ? selectedProcedures.length === 0 : !dateTime || loading}
                                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {step === 1 ? 'Continuar' : loading ? 'Agendando...' : 'Confirmar Agendamento'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
