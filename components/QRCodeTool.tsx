import React, { useState, useRef, useEffect } from "react";
import {
  QrCode,
  Link2,
  Copy,
  Download,
  RefreshCw,
  Info,
} from "lucide-react";
import QRCode from "qrcode";
import type { Theme } from "../App";

type ErrorCorrection = "L" | "M" | "Q" | "H";

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
      {title}
    </span>
  </div>
);

const UtilityButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-200 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
  >
    {icon}
    {label}
  </button>
);

const StyledInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}> = ({ value, onChange, placeholder, label, icon }) => (
  <div className="w-full mb-4 group">
    {label && (
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm p-3 pl-10 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm resize-none"
      />
      <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

export const QrCodeTool: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrection>("M");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const hasContent = input.trim().length > 0;

  // Draw QR code whenever dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bgColor = theme === "dark" ? "#050706" : "#ffffff";

    QRCode.toCanvas(canvas, hasContent ? input : " ", {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorCorrection,
      color: {
        dark: "#020617", // slate-950-ish
        light: bgColor,
      },
    }).catch(() => {
      // fail silently; this is display only
    });
  }, [input, size, errorCorrection, theme, hasContent]);

  const handleClear = () => setInput("");

  const handleCopy = async () => {
    if (!hasContent || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(input);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white transform -rotate-6 flex items-center justify-center">
          <QrCode size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          QR Code Generator
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-300 max-w-[420px] mx-auto leading-relaxed">
          Turn any URL or text into a clean, downloadable QR code. Built for fast, everyday marketing workflows.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-200 dark:border-zinc-700 p-6">
        {/* Input section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader title="Input" icon={<Link2 size={16} />} />
            <div className="flex gap-2">
              <UtilityButton
                label="Copy text"
                icon={<Copy size={12} />}
                onClick={handleCopy}
              />
              <UtilityButton
                label="Clear"
                icon={<RefreshCw size={12} />}
                onClick={handleClear}
              />
            </div>
          </div>

          <StyledInput
            label="URL or text"
            value={input}
            onChange={setInput}
            placeholder="Paste a link or type any text you want to encode..."
            icon={<Link2 size={16} />}
          />

          <div className="flex flex-wrap gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Size
              </span>
              <div className="flex rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 overflow-hidden text-gray-600 dark:text-gray-200">
                {[192, 256, 320].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={
                      "px-3 py-1.5 transition-all duration-150 text-[11px] font-semibold" +
                      (size === s
                        ? " bg-blue-600 dark:bg-blue-500 text-white"
                        : " bg-transparent")
                    }
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Error correction
              </span>
              <select
                value={errorCorrection}
                onChange={(e) =>
                  setErrorCorrection(e.target.value as ErrorCorrection)
                }
                className="text-[11px] rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-200 px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-150"
              >
                <option value="L">L (light)</option>
                <option value="M">M (medium)</option>
                <option value="Q">Q (quartile)</option>
                <option value="H">H (high)</option>
              </select>
            </div>
          </div>
        </div>

        {/* QR Preview section */}
        <div>
          <SectionHeader title="QR Preview" icon={<Info size={16} />} />

          <div className="flex flex-col items-center gap-4">
            <div className="rounded-3xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950/60 p-4 shadow-inner">
              <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="block"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-colors"
              >
                <Download size={16} />
                Download PNG
              </button>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center max-w-xs">
              Tip: Use high error correction and a larger size for QR codes that need to scan reliably from distance or in print.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
