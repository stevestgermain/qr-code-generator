import React from 'react';
import { QrCode } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white transform -rotate-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
        <QrCode className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
        QR Code Generator
      </h1>
      <p className="text-[13px] text-gray-500 max-w-[420px] mx-auto font-normal leading-relaxed">
        Generate reliable QR codes instantly. Add your logo, customize the URL, and download in high quality.
      </p>
    </div>
  );
};