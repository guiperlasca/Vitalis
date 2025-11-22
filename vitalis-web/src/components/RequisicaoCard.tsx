import { motion } from 'framer-motion';
import { Clock, User, Trash2, Edit, CheckCircle } from 'lucide-react';
import type { RequisicaoResponse } from '../services/requisicaoService';

interface RequisicaoCardProps {
    requisicao: RequisicaoResponse;
    onEdit: (requisicao: RequisicaoResponse) => void;
    onDelete: (id: number) => void;
    onUpdateStatus: (id: number, status: RequisicaoResponse['status']) => void;
}

const statusColors = {
    PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    EM_ANDAMENTO: 'bg-blue-100 text-blue-800 border-blue-300',
    CONCLUIDA: 'bg-green-100 text-green-800 border-green-300',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300',
};

const prioridadeColors = {
    BAIXA: 'bg-gray-100 text-gray-700 border-gray-300',
    MEDIA: 'bg-blue-100 text-blue-700 border-blue-300',
    ALTA: 'bg-orange-100 text-orange-700 border-orange-300',
    URGENTE: 'bg-red-100 text-red-700 border-red-300',
};

const statusLabels = {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
};

const prioridadeLabels = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
    URGENTE: 'Urgente',
};

export function RequisicaoCard({ requisicao, onEdit, onDelete, onUpdateStatus }: RequisicaoCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6 hover-lift border-2 border-white/30 hover:border-electric-300 transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-secondary-900 mb-2 line-clamp-2">
                        {requisicao.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[requisicao.status]}`}>
                            {statusLabels[requisicao.status]}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${prioridadeColors[requisicao.prioridade]}`}>
                            {prioridadeLabels[requisicao.prioridade]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                {requisicao.descricao}
            </p>

            {/* Meta Info */}
            <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-secondary-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Solicitante:</span>
                    <span>{requisicao.solicitante}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-500">
                    <Clock className="w-4 h-4" />
                    <span>Criado em {formatDate(requisicao.dataCriacao)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-secondary-200">
                {requisicao.status !== 'CONCLUIDA' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onUpdateStatus(requisicao.id, 'CONCLUIDA')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Concluir
                    </motion.button>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(requisicao)}
                    className="flex items-center gap-2 px-4 py-2 bg-electric-500 text-white rounded-lg hover:bg-electric-600 transition-colors text-sm font-medium"
                >
                    <Edit className="w-4 h-4" />
                    Editar
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(requisicao.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium ml-auto"
                >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                </motion.button>
            </div>
        </motion.div>
    );
}
