import { MapPin, Star, ChevronRight } from 'lucide-react';

interface Clinic {
    id: number;
    nomeFantasia: string;
    especialidade: string;
    endereco: string;
    avaliacao: number;
}

interface ClinicCardProps {
    clinic: Clinic;
    onClick: () => void;
}

const specialtyColors: Record<string, string> = {
    'Cardiologia': 'bg-red-50 text-red-700 ring-red-600/10',
    'Clínica Geral': 'bg-blue-50 text-blue-700 ring-blue-600/10',
    'Dermatologia': 'bg-purple-50 text-purple-700 ring-purple-600/10',
    'Pediatria': 'bg-pink-50 text-pink-700 ring-pink-600/10',
    'Ortopedia': 'bg-orange-50 text-orange-700 ring-orange-600/10',
    'default': 'bg-slate-50 text-slate-700 ring-slate-600/10'
};

export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
    const badgeClass = specialtyColors[clinic.especialidade] || specialtyColors.default;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-card hover:border-primary-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ChevronRight className="w-5 h-5 text-primary-500" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${badgeClass} mb-3`}>
                        {clinic.especialidade}
                    </span>
                    <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {clinic.nomeFantasia}
                    </h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">
                        {clinic.avaliacao.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{clinic.endereco}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium text-primary-600 group-hover:underline">Ver detalhes</span>
            </div>
        </div>
    );
}
