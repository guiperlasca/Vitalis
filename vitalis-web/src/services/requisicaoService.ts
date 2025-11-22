import api from './api';

export interface RequisicaoRequest {
    titulo: string;
    descricao: string;
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    solicitante: string;
}

export interface RequisicaoResponse {
    id: number;
    titulo: string;
    descricao: string;
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    solicitante: string;
    dataCriacao: string;
    dataAtualizacao: string;
}

export const requisicaoService = {
    async createRequisicao(data: RequisicaoRequest): Promise<RequisicaoResponse> {
        const response = await api.post('/requisicoes', data);
        return response.data;
    },

    async getAllRequisicoes(): Promise<RequisicaoResponse[]> {
        const response = await api.get('/requisicoes');
        return response.data;
    },

    async getRequisicaoById(id: number): Promise<RequisicaoResponse> {
        const response = await api.get(`/requisicoes/${id}`);
        return response.data;
    },

    async updateRequisicao(id: number, data: RequisicaoRequest): Promise<RequisicaoResponse> {
        const response = await api.put(`/requisicoes/${id}`, data);
        return response.data;
    },

    async updateStatus(id: number, status: RequisicaoResponse['status']): Promise<RequisicaoResponse> {
        const response = await api.patch(`/requisicoes/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    async deleteRequisicao(id: number): Promise<void> {
        await api.delete(`/requisicoes/${id}`);
    },

    async getByStatus(status: RequisicaoResponse['status']): Promise<RequisicaoResponse[]> {
        const response = await api.get(`/requisicoes/status/${status}`);
        return response.data;
    },

    async getByPrioridade(prioridade: RequisicaoResponse['prioridade']): Promise<RequisicaoResponse[]> {
        const response = await api.get(`/requisicoes/prioridade/${prioridade}`);
        return response.data;
    }
};
