import React from 'react';
import { Phone } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={generateGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with KING DAY"
      className="fixed bottom-20 md:bottom-8 right-5 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 md:p-4 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
    >
      <Phone className="w-6 h-6 md:w-7 md:h-7 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs md:text-sm pl-0 group-hover:pl-2">
        Chat with KING DAY
      </span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full animate-ping"></span>
    </a>
  );
};
