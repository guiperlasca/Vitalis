import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';
import { ClinicCard } from '../components/ClinicCard';
import { AppointmentModal } from '../components/AppointmentModal';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import api from '../services/api';

interface Clinic {
    id: number;
    nomeFantasia: string;
    especialidade: string;
    endereco: string;
    avaliacao: number;
}

const specialties = [
    'Todas',
    'Cardiologia',
    'Clínica Geral',
    'Dermatologia',
    'Pediatria',
    'Ortopedia'
];

export function Clinicas() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, success, error } = useToast();

    useEffect(() => {
        loadClinics();
    }, []);

    useEffect(() => {
        filterClinics();
    }, [searchTerm, selectedSpecialty, clinics]);

    const loadClinics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/clinicas');
            setClinics(response.data);
        } catch (err) {
            console.error('Error loading clinics:', err);
            error('Erro ao carregar clínicas');
        } finally {
            setLoading(false);
        }
    };

    const filterClinics = () => {
        let filtered = clinics;

        if (selectedSpecialty !== 'Todas') {
            filtered = filtered.filter(c => c.especialidade === selectedSpecialty);
        }

        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.endereco.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClinics(filtered);
    };

    const handleAppointmentSuccess = () => {
        success('Agendamento realizado com sucesso!');
        setSelectedClinic(null);
    };

    const handleAppointmentError = () => {
        error('Erro ao realizar agendamento. Tente novamente.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Hero Header with Tech Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-electric-600 via-cyber-600 to-neon-600">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-electric-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-neon-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="w-10 h-10 text-white animate-pulse-glow" />
                            <h1 className="text-5xl md:text-6xl font-bold text-white">
                                Encontre sua Clínica
                            </h1>
                        </div>
                        <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                            Agende consultas com as melhores clínicas da região
                        </p>

                        {/* Premium Search Bar */}
                        <div className="relative max-w-3xl mx-auto">
                            <div className="glass-card rounded-2xl p-2">
                                <div className="relative">
                                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-secondary-400 w-6 h-6" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou localização..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-electric-500 bg-white/90 backdrop-blur-sm text-lg font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tech Filters */}
            <div className="sticky top-0 z-20 glass-card border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Filter className="w-5 h-5 text-electric-600" />
                            <span className="text-sm font-semibold text-secondary-700">Filtrar:</span>
                        </div>
                        {specialties.map((specialty) => (
                            <motion.button
                                key={specialty}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedSpecialty === specialty
                                    ? 'bg-gradient-to-r from-electric-600 to-cyber-600 text-white shadow-electric'
                                    : 'bg-white/80 text-secondary-700 hover:bg-white hover:shadow-md border border-secondary-200'
                                    }`}
                            >
                                {specialty}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clinics Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-electric-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-electric-600 absolute top-0"></div>
                        </div>
                        <p className="mt-6 text-secondary-600 font-medium">Carregando clínicas...</p>
                    </div>
                ) : filteredClinics.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32"
                    >
                        <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
                            <MapPin className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                            <p className="text-secondary-600 text-lg font-medium">
                                Nenhuma clínica encontrada com os filtros selecionados.
                            </p>
                            <p className="text-secondary-500 text-sm mt-2">
                                Tente ajustar seus critérios de busca
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredClinics.map((clinic, index) => (
                            <motion.div
                                key={clinic.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <ClinicCard
                                    clinic={clinic}
                                    onClick={() => setSelectedClinic(clinic)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Appointment Modal */}
            {selectedClinic && (
                <AppointmentModal
                    isOpen={!!selectedClinic}
                    onClose={() => setSelectedClinic(null)}
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.nomeFantasia}
                    onSuccess={handleAppointmentSuccess}
                />
            )}
        </div>
    );
}
