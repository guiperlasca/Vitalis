import React from 'react';
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
    'Cardiologia': 'bg-red-100 text-red-700',
    'Clínica Geral': 'bg-blue-100 text-blue-700',
    'Dermatologia': 'bg-purple-100 text-purple-700',
    'Pediatria': 'bg-pink-100 text-pink-700',
    'Ortopedia': 'bg-orange-100 text-orange-700',
    'default': 'bg-primary-100 text-primary-700'
};

export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
    const badgeColor = specialtyColors[clinic.especialidade] || specialtyColors.default;

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white rounded-xl p-6 border border-secondary-200 cursor-pointer transition-all duration-200 hover:border-primary-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        {clinic.nomeFantasia}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                        {clinic.especialidade}
                    </span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-amber-700">
                        {clinic.avaliacao.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-secondary-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{clinic.endereco}</span>
            </div>
        </motion.div>
    );
}
