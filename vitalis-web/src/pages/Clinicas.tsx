import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
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
        <div className="min-h-screen bg-background">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Encontre sua Clínica</h1>
                        <p className="text-primary-100 text-lg mb-8">
                            Agende consultas com as melhores clínicas da região
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou localização..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-secondary-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <Filter className="w-5 h-5 text-secondary-600 flex-shrink-0" />
                        {specialties.map((specialty) => (
                            <button
                                key={specialty}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedSpecialty === specialty
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                    }`}
                            >
                                {specialty}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clinics Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredClinics.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-secondary-600 text-lg">
                            Nenhuma clínica encontrada com os filtros selecionados.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredClinics.map((clinic, index) => (
                            <motion.div
                                key={clinic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
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
