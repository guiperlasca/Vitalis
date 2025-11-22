import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

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
    'Cardiologia': 'bg-red-100 text-red-700 border-red-200',
    'Clínica Geral': 'bg-blue-100 text-blue-700 border-blue-200',
    'Dermatologia': 'bg-purple-100 text-purple-700 border-purple-200',
    'Pediatria': 'bg-pink-100 text-pink-700 border-pink-200',
    'Ortopedia': 'bg-orange-100 text-orange-700 border-orange-200',
    'default': 'bg-primary-100 text-primary-700 border-primary-200'
};

export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
    const badgeColor = specialtyColors[clinic.especialidade] || specialtyColors.default;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white rounded-xl p-6 border border-secondary-200 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-primary-400"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-secondary-900 mb-3 hover:text-primary-600 transition-colors">
                        {clinic.nomeFantasia}
                    </h3>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                        {clinic.especialidade}
                    </span>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex items-center gap-1 bg-gradient-to-br from-amber-50 to-amber-100 px-3 py-2 rounded-xl shadow-sm border border-amber-200"
                >
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">
                        {clinic.avaliacao.toFixed(1)}
                    </span>
                </motion.div>
            </div>

            <div className="flex items-center gap-2 text-secondary-600 text-sm mt-4 pt-4 border-t border-secondary-100">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{clinic.endereco}</span>
            </div>
        </motion.div>
    );
}
