import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link, Upload, Download, Trash2, Sliders } from 'lucide-react';

export const QRCodeTool: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>('');
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Clean up object URL on unmount or logo change
  useEffect(() => {
    return () => {
      if (logo && logo.startsWith('blob:')) {
        URL.revokeObjectURL(logo);
      }
    };
  }, [logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setLogo(objectUrl);
      setLogoName(file.name);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoName('');
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Determine if we can generate
  const canGenerate = url.trim().length > 0;

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 p-6">
      
      {/* URL Input Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Destination URL</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-base p-4 placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none"
          />
        </div>
      </div>

      {/* Logo Upload Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Logo Overlay (Optional)</h2>
        </div>
        
        {!logo ? (
          <label className="flex flex-col items-center justify-center w-full h-24 rounded-2xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer transition-all duration-200 group">
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <p className="text-[13px] text-gray-500 group-hover:text-blue-600 font-medium">Click to upload logo</p>
              <p className="text-[11px] text-gray-400 mt-1">PNG or JPG, max 2MB</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 p-1 flex-shrink-0">
                  <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
               </div>
               <span className="text-sm text-gray-700 truncate font-medium">{logoName}</span>
            </div>
            <button 
              onClick={removeLogo}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Preview</h2>
        </div>

        <div className="flex flex-col items-center justify-center">
            {/* The QR Canvas Container */}
            <div 
              ref={canvasRef}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 transition-all duration-300"
              style={{ opacity: canGenerate ? 1 : 0.5, filter: canGenerate ? 'none' : 'grayscale(100%)' }}
            >
              <QRCodeCanvas
                value={canGenerate ? url : 'https://example.com'}
                size={200}
                level={"H"} // High error correction for logos
                fgColor="#111827" // gray-900
                bgColor="#ffffff"
                imageSettings={logo ? {
                  src: logo,
                  height: 48,
                  width: 48,
                  excavate: true,
                } : undefined}
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
               <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Status</span>
                  <span className={`text-sm font-bold ${canGenerate ? 'text-green-600' : 'text-gray-400'}`}>
                    {canGenerate ? 'Ready' : 'Waiting for URL'}
                  </span>
               </div>
               
               <button
                 onClick={downloadQRCode}
                 disabled={!canGenerate}
                 className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border shadow-sm transition-all duration-200
                    ${canGenerate 
                      ? 'bg-gray-900 border-gray-900 text-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-md' 
                      : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}
                 `}
               >
                 <Download className="w-4 h-4" />
                 <span className="text-sm font-semibold">Download PNG</span>
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};