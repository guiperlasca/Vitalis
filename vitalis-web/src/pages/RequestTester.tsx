import { useState } from 'react';
import { Send, Database, Server, Code, Play, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

export function RequestTester() {
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('/clinicas');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    const handleSend = async () => {
        setLoading(true);
        setResponse(null);
        try {
            let res;
            if (method === 'GET') {
                res = await api.get(endpoint);
            } else if (method === 'POST') {
                res = await api.post(endpoint, body ? JSON.parse(body) : {});
            } else if (method === 'PUT') {
                res = await api.put(endpoint, body ? JSON.parse(body) : {});
            } else if (method === 'DELETE') {
                res = await api.delete(endpoint);
            }
            setResponse(res?.data);
            success(`Requisição ${method} realizada com sucesso!`);
        } catch (err: any) {
            console.error(err);
            setResponse(err.response?.data || err.message);
            error('Erro na requisição. Verifique o console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-mono">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Server className="w-8 h-8 text-electric-400" />
                        <h1 className="text-2xl font-bold text-white">API Request Tester</h1>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                            Connected
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Request Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-cyber-400" />
                                Configuração
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Método</label>
                                    <select
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none"
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Endpoint</label>
                                    <input
                                        type="text"
                                        value={endpoint}
                                        onChange={(e) => setEndpoint(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {(method === 'POST' || method === 'PUT') && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Body (JSON)</label>
                                        <textarea
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            rows={8}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-green-400 focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none resize-none"
                                            placeholder="{}"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleSend}
                                    disabled={loading}
                                    className="w-full py-3 bg-electric-600 hover:bg-electric-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Enviar Requisição
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-neon-400" />
                                Presets
                            </h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { setMethod('GET'); setEndpoint('/clinicas'); }}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-700/50 text-sm text-slate-300 transition-colors"
                                >
                                    GET /clinicas
                                </button>
                                <button
                                    onClick={() => { setMethod('GET'); setEndpoint('/pacientes'); }}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-700/50 text-sm text-slate-300 transition-colors"
                                >
                                    GET /pacientes
                                </button>
                                <button
                                    onClick={() => {
                                        setMethod('POST');
                                        setEndpoint('/auth/login');
                                        setBody('{\n  "username": "admin",\n  "password": "password"\n}');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-700/50 text-sm text-slate-300 transition-colors"
                                >
                                    POST /auth/login
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700 h-full flex flex-col">
                            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Code className="w-5 h-5 text-purple-400" />
                                    Response
                                </h2>
                                {response && (
                                    <button
                                        onClick={() => setResponse(null)}
                                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Limpar
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 p-4 overflow-auto min-h-[500px]">
                                {response ? (
                                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                                        {JSON.stringify(response, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                        <Server className="w-16 h-16 mb-4 opacity-20" />
                                        <p>Aguardando requisição...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
