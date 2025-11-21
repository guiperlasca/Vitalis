import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

interface MedicalRecord {
    descricaoSintomas: string;
    diagnostico: string;
    prescricaoMedica: string;
    dataRegistro: string;
}

interface MedicalRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: MedicalRecord | null;
}

export function MedicalRecordModal({ isOpen, onClose, record }: MedicalRecordModalProps) {
    if (!isOpen || !record) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">Prontuário Eletrônico</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-primary-100 text-sm mt-2">
                            Registrado em: {new Date(record.dataRegistro).toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Descrição dos Sintomas</h3>
                            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                                <p className="text-secondary-900 whitespace-pre-wrap">{record.descricaoSintomas}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Diagnóstico</h3>
                            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                                <p className="text-secondary-900 whitespace-pre-wrap">{record.diagnostico}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Prescrição Médica</h3>
                            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                                <p className="text-secondary-900 whitespace-pre-wrap">{record.prescricaoMedica}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-secondary-200 p-6 bg-secondary-50">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
