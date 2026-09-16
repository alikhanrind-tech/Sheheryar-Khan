import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { QRConfig } from '../../types';
import { QR_SIZE_MAP, formatQRContent, downloadQRPNG, downloadQRSVG, generateQRSVG } from '../../utils/qrUtils';
import { Download, Copy, Check, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface QRPreviewProps {
  config: QRConfig;
  onSaveToHistory?: (dataUrl: string, rawContent: string) => void;
}

export function QRPreview({ config, onSaveToHistory }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [isCopiedContent, setIsCopiedContent] = useState(false);
  const [isCopiedImage, setIsCopiedImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rawContent = formatQRContent(config);

  const drawCenterIcon = useCallback((ctx: CanvasRenderingContext2D, size: number, iconType: string) => {
    if (iconType === 'none') return;
    const center = size / 2;
    const badgeSize = size * 0.22;
    const radius = badgeSize / 2;

    // Draw background rounded pill for logo
    ctx.save();
    ctx.fillStyle = config.bgColor || '#FFFFFF';
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.lineWidth = Math.max(2, size * 0.01);
    ctx.strokeStyle = config.fgColor || '#073B2A';
    ctx.stroke();

    // Icon glyph
    ctx.fillStyle = config.fgColor || '#073B2A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${badgeSize * 0.55}px sans-serif`;

    let glyph = '✦';
    if (iconType === 'link') glyph = '🔗';
    if (iconType === 'wifi') glyph = '📶';
    if (iconType === 'sparkle') glyph = '✨';

    ctx.fillText(glyph, center, center);
    ctx.restore();
  }, [config.bgColor, config.fgColor]);

  const renderQRCode = useCallback(async () => {
    if (!rawContent) {
      setErrorMsg('Enter content on the left to generate code');
      setDataUrl('');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMsg(null);
      const pixelSize = QR_SIZE_MAP[config.size] || 512;

      // 1. Generate to Canvas for dynamic display & PNG download
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = pixelSize;
      canvas.height = pixelSize;

      await QRCode.toCanvas(canvas, rawContent, {
        width: pixelSize,
        margin: config.margin,
        errorCorrectionLevel: config.centerLogo !== 'none' ? 'H' : config.errorCorrectionLevel,
        color: {
          dark: config.fgColor || '#000000',
          light: config.transparentBg ? '#00000000' : config.bgColor || '#FFFFFF',
        },
      });

      // Overlay center emblem if specified
      if (config.centerLogo && config.centerLogo !== 'none') {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawCenterIcon(ctx, pixelSize, config.centerLogo);
        }
      }

      const generatedDataUrl = canvas.toDataURL('image/png');
      setDataUrl(generatedDataUrl);

      // 2. Generate SVG for vector download
      const svg = await generateQRSVG(rawContent, {
        errorCorrectionLevel: config.centerLogo !== 'none' ? 'H' : config.errorCorrectionLevel,
        fgColor: config.fgColor,
        bgColor: config.bgColor,
        transparentBg: config.transparentBg,
        margin: config.margin,
      });
      setSvgString(svg);
    } catch (err: unknown) {
      console.error('QR code generation failed:', err);
      setErrorMsg('Content is too long for selected error correction level. Lower correction level or shorten content.');
    } finally {
      setIsGenerating(false);
    }
  }, [
    rawContent,
    config.size,
    config.margin,
    config.errorCorrectionLevel,
    config.centerLogo,
    config.fgColor,
    config.bgColor,
    config.transparentBg,
    drawCenterIcon,
  ]);

  useEffect(() => {
    renderQRCode();
  }, [renderQRCode]);

  const handleDownloadPNG = async () => {
    if (!dataUrl) return;
    if (onSaveToHistory && rawContent) {
      onSaveToHistory(dataUrl, rawContent);
    }
    const filename = `qrforge-${config.contentType}-${Date.now()}.png`;
    await downloadQRPNG(dataUrl, filename);
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;
    if (onSaveToHistory && rawContent && dataUrl) {
      onSaveToHistory(dataUrl, rawContent);
    }
    const filename = `qrforge-${config.contentType}-${Date.now()}.svg`;
    downloadQRSVG(svgString, filename);
  };

  const handleCopyContent = async () => {
    if (!rawContent) return;
    try {
      await navigator.clipboard.writeText(rawContent);
      setIsCopiedContent(true);
      setTimeout(() => setIsCopiedContent(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    if (onSaveToHistory && rawContent && dataUrl) {
      onSaveToHistory(dataUrl, rawContent);
    }
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setIsCopiedImage(true);
        setTimeout(() => setIsCopiedImage(false), 2000);
      });
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      // Fallback: copy content
      handleCopyContent();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-[#F7FAF8] p-5 sm:p-7 rounded-2xl border border-black/5" id="qr-preview-panel">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-[#101513] uppercase tracking-wider block">
            Live Preview
          </span>
          <span className="text-xs text-[#7D9187]">
            {QR_SIZE_MAP[config.size]} × {QR_SIZE_MAP[config.size]} px • {config.errorCorrectionLevel} Level
          </span>
        </div>

        {rawContent && !errorMsg ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#073B2A] bg-[#20D47A]/20 px-2.5 py-1 rounded-full border border-[#20D47A]/30">
            <Check className="w-3 h-3 text-[#105B38]" />
            QR code ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7D9187] bg-black/5 px-2.5 py-1 rounded-full">
            Awaiting input
          </span>
        )}
      </div>

      {/* Center Canvas Display Area */}
      <div className="relative my-auto flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-black/5 w-full max-w-[280px] sm:max-w-[320px] aspect-square group">
        {/* Transparent checkerboard background if transparent mode */}
        {config.transparentBg && (
          <div className="absolute inset-4 rounded-xl bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] opacity-40 pointer-events-none" />
        )}

        {rawContent ? (
          <canvas
            ref={canvasRef}
            id="qr-canvas-element"
            className="w-full h-full max-w-[260px] max-h-[260px] object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
            aria-label="Generated QR Code Preview"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 text-[#7D9187]">
            <div className="w-12 h-12 rounded-xl bg-[#F0F5F2] flex items-center justify-center mb-3 text-[#7D9187]">
              <Sparkles className="w-6 h-6 text-[#20D47A]" />
            </div>
            <p className="text-xs font-medium text-[#50635B]">
              Enter a link or text to generate your QR preview
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
            <RefreshCw className="w-6 h-6 text-[#20D47A] animate-spin" />
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="absolute inset-4 bg-white/95 flex flex-col items-center justify-center p-4 rounded-xl text-center">
            <AlertCircle className="w-7 h-7 text-amber-500 mb-2" />
            <p className="text-xs font-semibold text-[#101513]">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 mt-5">
        <div className="grid grid-cols-2 gap-2">
          {/* Primary PNG Download */}
          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={!dataUrl || !!errorMsg}
            id="btn-download-png"
            className="flex items-center justify-center gap-2 bg-[#073B2A] hover:bg-[#105B38] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl transition-all duration-150 shadow-md shadow-[#073B2A]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#20D47A]"
          >
            <Download className="w-4 h-4 text-[#20D47A]" />
            <span>Download PNG</span>
          </button>

          {/* Vector SVG Download */}
          <button
            type="button"
            onClick={handleDownloadSVG}
            disabled={!svgString || !!errorMsg}
            id="btn-download-svg"
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#F0F5F2] text-[#073B2A] font-semibold text-xs sm:text-sm py-3 px-3 rounded-xl border border-[#D5E0DB] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#20D47A]"
          >
            <Download className="w-4 h-4 text-[#7D9187]" />
            <span>Vector SVG</span>
          </button>
        </div>

        {/* Secondary Clipboard Copy Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyContent}
            disabled={!rawContent}
            id="btn-copy-content"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-[#50635B] hover:text-[#101513] hover:bg-black/5 border border-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isCopiedContent ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#20D47A]" />
                <span className="text-[#073B2A] font-semibold">Copied Text!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Data</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={!dataUrl}
            id="btn-copy-image"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-[#50635B] hover:text-[#101513] hover:bg-black/5 border border-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isCopiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#20D47A]" />
                <span className="text-[#073B2A] font-semibold">Image Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
