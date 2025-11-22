import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { RequisicaoCard } from '../components/RequisicaoCard';
import { RequisicaoForm } from '../components/RequisicaoForm';
import { requisicaoService } from '../services/requisicaoService';
import type { RequisicaoResponse, RequisicaoRequest } from '../services/requisicaoService';

export function AdminDashboard() {
    const [requisicoes, setRequisicoes] = useState<RequisicaoResponse[]>([]);
    const [filteredRequisicoes, setFilteredRequisicoes] = useState<RequisicaoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRequisicao, setEditingRequisicao] = useState<RequisicaoResponse | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('TODAS');
    const [prioridadeFilter, setPrioridadeFilter] = useState<string>('TODAS');

    useEffect(() => {
        loadRequisicoes();
    }, []);

    useEffect(() => {
        filterRequisicoes();
    }, [statusFilter, prioridadeFilter, requisicoes]);

    const loadRequisicoes = async () => {
        try {
            setLoading(true);
            const data = await requisicaoService.getAllRequisicoes();
            setRequisicoes(data);
        } catch (error) {
            console.error('Erro ao carregar requisições:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRequisicoes = () => {
        let filtered = requisicoes;

        if (statusFilter !== 'TODAS') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        if (prioridadeFilter !== 'TODAS') {
            filtered = filtered.filter(r => r.prioridade === prioridadeFilter);
        }

        setFilteredRequisicoes(filtered);
    };

    const handleCreateOrUpdate = async (data: RequisicaoRequest) => {
        try {
            setFormLoading(true);
            if (editingRequisicao) {
                await requisicaoService.updateRequisicao(editingRequisicao.id, data);
            } else {
                await requisicaoService.createRequisicao(data);
            }
            await loadRequisicoes();
            setIsFormOpen(false);
            setEditingRequisicao(null);
        } catch (error) {
            console.error('Erro ao salvar requisição:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (requisicao: RequisicaoResponse) => {
        setEditingRequisicao(requisicao);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta requisição?')) return;

        try {
            await requisicaoService.deleteRequisicao(id);
            await loadRequisicoes();
        } catch (error) {
            console.error('Erro ao deletar requisição:', error);
        }
    };

    const handleUpdateStatus = async (id: number, status: RequisicaoResponse['status']) => {
        try {
            await requisicaoService.updateStatus(id, status);
            await loadRequisicoes();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleNewRequisicao = () => {
        setEditingRequisicao(null);
        setIsFormOpen(true);
    };

    const stats = {
        total: requisicoes.length,
        pendentes: requisicoes.filter(r => r.status === 'PENDENTE').length,
        emAndamento: requisicoes.filter(r => r.status === 'EM_ANDAMENTO').length,
        concluidas: requisicoes.filter(r => r.status === 'CONCLUIDA').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-electric-600 via-cyber-600 to-neon-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-bold mb-4">Dashboard Admin</h1>
                        <p className="text-white/90 text-xl">Gestão de Requisições do Sistema</p>
                    </motion.div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-6 border-2 border-white/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm font-medium mb-1">Total</p>
                                <p className="text-4xl font-bold text-secondary-900">{stats.total}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-electric-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-2xl p-6 border-2 border-white/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm font-medium mb-1">Pendentes</p>
                                <p className="text-4xl font-bold text-yellow-600">{stats.pendentes}</p>
                            </div>
                            <Clock className="w-12 h-12 text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-2xl p-6 border-2 border-white/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm font-medium mb-1">Em Andamento</p>
                                <p className="text-4xl font-bold text-blue-600">{stats.emAndamento}</p>
                            </div>
                            <AlertTriangle className="w-12 h-12 text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6 border-2 border-white/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm font-medium mb-1">Concluídas</p>
                                <p className="text-4xl font-bold text-green-600">{stats.concluidas}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Actions & Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewRequisicao}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-600 to-cyber-600 text-white rounded-xl font-semibold shadow-electric hover:shadow-glow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Requisição
                    </motion.button>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-secondary-600" />
                            <span className="text-sm font-semibold text-secondary-700">Filtros:</span>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none text-sm font-medium"
                        >
                            <option value="TODAS">Todos Status</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="EM_ANDAMENTO">Em Andamento</option>
                            <option value="CONCLUIDA">Concluída</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>

                        <select
                            value={prioridadeFilter}
                            onChange={(e) => setPrioridadeFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border-2 border-secondary-200 focus:border-electric-500 focus:ring-2 focus:ring-electric-200 transition-all outline-none text-sm font-medium"
                        >
                            <option value="TODAS">Todas Prioridades</option>
                            <option value="BAIXA">Baixa</option>
                            <option value="MEDIA">Média</option>
                            <option value="ALTA">Alta</option>
                            <option value="URGENTE">Urgente</option>
                        </select>
                    </div>
                </div>

                {/* Requisições Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-electric-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-electric-600 absolute top-0"></div>
                        </div>
                        <p className="mt-6 text-secondary-600 font-medium">Carregando requisições...</p>
                    </div>
                ) : filteredRequisicoes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32"
                    >
                        <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
                            <XCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                            <p className="text-secondary-600 text-lg font-medium">
                                Nenhuma requisição encontrada
                            </p>
                            <p className="text-secondary-500 text-sm mt-2">
                                Crie uma nova requisição ou ajuste os filtros
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {filteredRequisicoes.map((requisicao) => (
                            <RequisicaoCard
                                key={requisicao.id}
                                requisicao={requisicao}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <RequisicaoForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingRequisicao(null);
                }}
                onSubmit={handleCreateOrUpdate}
                initialData={editingRequisicao}
                loading={formLoading}
            />
        </div>
    );
}
