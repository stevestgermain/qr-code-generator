import React, { useState } from 'react';
import { QRCodeTool } from './components/QRCodeTool';
import { Header } from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-white pt-6 pb-12 px-4 flex justify-center items-start font-sans">
      <div className="w-full max-w-[460px] mx-auto flex flex-col items-center">
        <Header />
        <QRCodeTool />
      </div>
    </div>
  );
}