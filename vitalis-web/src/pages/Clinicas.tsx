import { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
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
            console.log('Fetching clinics...');
            const response = await api.get('/clinicas');
            console.log('Clinics response:', response.data);
            setClinics(response.data);
        } catch (err) {
            console.error('Error loading clinics:', err);
            error('Erro ao carregar clínicas. Verifique sua conexão.');
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

    return (
        <DashboardLayout
            title="Encontre Especialistas"
            subtitle="Agende consultas com as melhores clínicas e profissionais de saúde da sua região."
        >
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Search Bar */}
            <div className="mb-8 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome da clínica, especialidade ou endereço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Filters Bar */}
            <div className="mb-8">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm flex-shrink-0">
                        <Filter className="w-4 h-4" />
                        <span>Filtros:</span>
                    </div>
                    {specialties.map((specialty) => (
                        <button
                            key={specialty}
                            onClick={() => setSelectedSpecialty(specialty)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedSpecialty === specialty
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {specialty}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clinics Grid */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 font-medium">Buscando clínicas disponíveis...</p>
                    </div>
                ) : filteredClinics.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma clínica encontrada</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Não encontramos resultados para sua busca. Tente limpar os filtros ou buscar por outro termo.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedSpecialty('Todas'); }}
                            className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClinics.map((clinic) => (
                            <ClinicCard
                                key={clinic.id}
                                clinic={clinic}
                                onClick={() => setSelectedClinic(clinic)}
                            />
                        ))}
                    </div>
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
        </DashboardLayout>
    );
}
