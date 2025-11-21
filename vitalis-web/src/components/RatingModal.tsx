import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import api from '../services/api';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: number;
    clinicName: string;
    onSuccess: () => void;
}

export function RatingModal({ isOpen, onClose, appointmentId, clinicName, onSuccess }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        try {
            setLoading(true);
            await api.post('/avaliacoes', {
                agendamentoId: appointmentId,
                nota: rating,
                comentario: comment
            });
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRating(0);
        setHoveredRating(0);
        setComment('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full"
                >
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Avaliar Atendimento</h2>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-amber-100 text-sm mt-2">{clinicName}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <p className="text-center text-secondary-700 mb-4 font-medium">
                                Como foi sua experiência?
                            </p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                                    ? 'text-amber-500 fill-amber-500'
                                                    : 'text-secondary-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-sm text-secondary-600 mt-2">
                                    {rating === 1 && 'Muito Insatisfeito'}
                                    {rating === 2 && 'Insatisfeito'}
                                    {rating === 3 && 'Neutro'}
                                    {rating === 4 && 'Satisfeito'}
                                    {rating === 5 && 'Muito Satisfeito'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Comentário (opcional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Conte-nos mais sobre sua experiência..."
                            />
                        </div>
                    </div>

                    <div className="border-t border-secondary-200 p-6 bg-secondary-50 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || loading}
                            className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
