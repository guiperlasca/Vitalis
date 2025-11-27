import { useState, useEffect } from 'react';
import { FileText, Calendar, Stethoscope, Activity, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

interface Prontuario {
    id: number;
    descricaoSintomas: string;
    diagnostico: string;
    prescricaoMedica: string;
    dataRegistro: string;
}

interface Agendamento {
    id: number;
    pacienteNome: string;
    clinicaNomeFantasia: string;
    dataHora: string;
    status: string;
    prontuario: Prontuario | null;
}

export function ProntuarioPaciente() {
    const [records, setRecords] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { toasts, removeToast, error } = useToast();

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get('/agendamentos/paciente');
            // Filter only appointments with medical records
            const appointmentsWithRecords = response.data.filter((a: Agendamento) => a.prontuario !== null);
            // Sort by date descending
            appointmentsWithRecords.sort((a: Agendamento, b: Agendamento) =>
                new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
            );
            setRecords(appointmentsWithRecords);
        } catch (err) {
            console.error('Error loading records:', err);
            error('Erro ao carregar prontuário.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <FileText className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">
                            Meu Prontuário
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600">
                        Histórico completo de suas consultas, diagnósticos e prescrições.
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500">Carregando histórico...</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum registro encontrado</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Você ainda não possui registros médicos de consultas realizadas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {records.map((record) => (
                            <div
                                key={record.id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                {/* Card Header / Summary */}
                                <div
                                    onClick={() => toggleExpand(record.id)}
                                    className="p-6 cursor-pointer flex items-start justify-between bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 p-2 bg-primary-50 rounded-lg text-primary-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                Consulta em {record.clinicaNomeFantasia}
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                {record.dataHora}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Realizada
                                        </span>
                                        {expandedId === record.id ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === record.id && record.prontuario && (
                                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Symptoms */}
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3 text-slate-900 font-semibold">
                                                    <Activity className="w-4 h-4 text-orange-500" />
                                                    <h4>Sintomas Relatados</h4>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    {record.prontuario.descricaoSintomas}
                                                </p>
                                            </div>

                                            {/* Diagnosis */}
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3 text-slate-900 font-semibold">
                                                    <Stethoscope className="w-4 h-4 text-primary-500" />
                                                    <h4>Diagnóstico</h4>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    {record.prontuario.diagnostico}
                                                </p>
                                            </div>

                                            {/* Prescription */}
                                            <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3 text-slate-900 font-semibold">
                                                    <Pill className="w-4 h-4 text-purple-500" />
                                                    <h4>Prescrição Médica</h4>
                                                </div>
                                                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-mono bg-slate-50 p-3 rounded border border-slate-100">
                                                    {record.prontuario.prescricaoMedica}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
