import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, FileText } from 'lucide-react';
import api from '../services/api';

interface AttendanceFormProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: number;
    patientName: string;
    onSuccess: () => void;
}

export function AttendanceForm({ isOpen, onClose, appointmentId, patientName, onSuccess }: AttendanceFormProps) {
    const [descricaoSintomas, setDescricaoSintomas] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [prescricaoMedica, setPrescricaoMedica] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!descricaoSintomas || !diagnostico || !prescricaoMedica) return;

        try {
            setLoading(true);
            await api.post(`/agendamentos/${appointmentId}/prontuario`, {
                descricaoSintomas,
                diagnostico,
                prescricaoMedica
            });
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error creating medical record:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setDescricaoSintomas('');
        setDiagnostico('');
        setPrescricaoMedica('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6" />
                                <div>
                                    <h2 className="text-2xl font-bold">Prontuário Eletrônico</h2>
                                    <p className="text-primary-100 text-sm mt-1">Paciente: {patientName}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-220px)]">
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Descrição dos Sintomas *
                            </label>
                            <textarea
                                value={descricaoSintomas}
                                onChange={(e) => setDescricaoSintomas(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descreva os sintomas relatados pelo paciente..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Diagnóstico *
                            </label>
                            <textarea
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Informe o diagnóstico médico..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Prescrição Médica *
                            </label>
                            <textarea
                                value={prescricaoMedica}
                                onChange={(e) => setPrescricaoMedica(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descreva a prescrição médica, medicamentos, dosagens e orientações..."
                            />
                        </div>
                    </div>

                    <div className="border-t border-secondary-200 p-6 bg-secondary-50 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!descricaoSintomas || !diagnostico || !prescricaoMedica || loading}
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Salvando...' : 'Salvar Prontuário'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
