import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { RequisicaoRequest, RequisicaoResponse } from '../services/requisicaoService';

interface RequisicaoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RequisicaoRequest) => void;
    initialData?: RequisicaoResponse | null;
    loading?: boolean;
}

export function RequisicaoForm({ isOpen, onClose, onSubmit, initialData, loading }: RequisicaoFormProps) {
    const [formData, setFormData] = useState<RequisicaoRequest>({
        titulo: '',
        descricao: '',
        status: 'PENDENTE',
        prioridade: 'MEDIA',
        solicitante: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo,
                descricao: initialData.descricao,
                status: initialData.status,
                prioridade: initialData.prioridade,
                solicitante: initialData.solicitante,
            });
        } else {
            setFormData({
                titulo: '',
                descricao: '',
                status: 'PENDENTE',
                prioridade: 'MEDIA',
                solicitante: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-white/30"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold gradient-text-cyber">
                            {initialData ? 'Editar Requisição' : 'Nova Requisição'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-secondary-600" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={200}
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none"
                                placeholder="Digite o título da requisição"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none resize-none"
                                placeholder="Descreva a requisição em detalhes"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as RequisicaoRequest['status'] })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none"
                                >
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="EM_ANDAMENTO">Em Andamento</option>
                                    <option value="CONCLUIDA">Concluída</option>
                                    <option value="CANCELADA">Cancelada</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                    Prioridade
                                </label>
                                <select
                                    value={formData.prioridade}
                                    onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as RequisicaoRequest['prioridade'] })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none"
                                >
                                    <option value="BAIXA">Baixa</option>
                                    <option value="MEDIA">Média</option>
                                    <option value="ALTA">Alta</option>
                                    <option value="URGENTE">Urgente</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                Solicitante
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={100}
                                value={formData.solicitante}
                                onChange={(e) => setFormData({ ...formData, solicitante: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none"
                                placeholder="Nome do solicitante"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-secondary-200 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-300 transition-colors"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-electric-600 to-cyber-600 text-white rounded-xl font-semibold hover:from-electric-700 hover:to-cyber-700 transition-all shadow-electric disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Requisição'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
