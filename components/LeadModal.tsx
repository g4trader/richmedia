import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseInterest: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, courseInterest }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <h3 className="font-display font-bold text-2xl">Garanta sua Bolsa</h3>
          <p className="text-blue-200 text-sm mt-1">Interesse em: <span className="font-bold text-white">{courseInterest}</span></p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Inscrição Realizada!</h4>
                <p className="text-gray-500">Nossos consultores entrarão em contato em breve.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="(00) 90000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="seu@email.com" />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg shadow-md transform transition-all active:scale-95 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'QUERO ME INSCREVER'}
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Ao enviar, você concorda com nossa Política de Privacidade.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
