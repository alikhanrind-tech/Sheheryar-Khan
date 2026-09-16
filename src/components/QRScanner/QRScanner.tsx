import { useState, useRef, useEffect, useCallback, ChangeEvent, DragEvent } from 'react';
import jsQR from 'jsqr';
import { ScanResult, scanImageFile, parseDecodedQR } from '../../utils/scanUtils';
import { QRConfig } from '../../types';
import {
  Camera,
  Upload,
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  QrCode,
  FileImage,
  Wifi,
  Globe,
  Mail,
  Phone,
  Contact,
  FileText,
  SwitchCamera
} from 'lucide-react';

interface QRScannerProps {
  onLoadIntoGenerator: (config: Partial<QRConfig>) => void;
  onClose?: () => void;
}

export function QRScanner({ onLoadIntoGenerator }: QRScannerProps) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Scan video frame continuously
  const scanVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          const parsed = parseDecodedQR(code.data);
          setScanResult(parsed);
          setErrorMessage(null);
          stopCamera();
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [stopCamera]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScanResult(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const msg =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera access denied. Please grant permission in your browser.'
          : 'Unable to start camera. Please ensure it is connected or try uploading an image.';
      setCameraError(msg);
      setIsCameraActive(false);
    }
  }, [cameraFacing, scanVideoFrame, stopCamera]);

  // Handle switching camera facing
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, cameraFacing, startCamera, stopCamera]);

  // File Upload Handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setScanResult(null);

    try {
      const result = await scanImageFile(file);
      if (result) {
        setScanResult(result);
      } else {
        setErrorMessage('No valid QR code was detected in the uploaded image. Try another photo or adjust contrast.');
      }
    } catch (err) {
      console.error('File scan error:', err);
      setErrorMessage('Could not process this file. Please ensure it is a valid image (PNG, JPG, WEBP).');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setScanResult(null);

    try {
      const result = await scanImageFile(file);
      if (result) {
        setScanResult(result);
      } else {
        setErrorMessage('No valid QR code was detected in the dropped image.');
      }
    } catch (err) {
      console.error('Drop scan error:', err);
      setErrorMessage('Failed to read dropped file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clipboard Paste Support (Ctrl+V anywhere in upload tab)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (mode !== 'upload') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setIsProcessing(true);
            setErrorMessage(null);
            try {
              const res = await scanImageFile(file);
              if (res) setScanResult(res);
              else setErrorMessage('No QR code detected in pasted image.');
            } catch {
              setErrorMessage('Failed to read pasted image.');
            } finally {
              setIsProcessing(false);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="w-5 h-5 text-[#20D47A]" />;
      case 'wifi': return <Wifi className="w-5 h-5 text-[#20D47A]" />;
      case 'email': return <Mail className="w-5 h-5 text-[#20D47A]" />;
      case 'phone': return <Phone className="w-5 h-5 text-[#20D47A]" />;
      case 'vcard': return <Contact className="w-5 h-5 text-[#20D47A]" />;
      default: return <FileText className="w-5 h-5 text-[#20D47A]" />;
    }
  };

  return (
    <div className="space-y-6" id="qr-scanner-component">
      {/* Scanner Mode Switcher (Upload File vs Live Camera) */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-black/5">
        <div className="flex items-center gap-1.5 p-1 bg-[#F0F5F2] rounded-xl border border-black/5">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-white text-[#073B2A] shadow-sm border border-black/5 ring-1 ring-[#20D47A]/30'
                : 'text-[#50635B] hover:text-[#101513]'
            }`}
            id="tab-scanner-upload"
          >
            <Upload className="w-4 h-4 text-[#20D47A]" />
            Upload / Drop Image
          </button>
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'camera'
                ? 'bg-white text-[#073B2A] shadow-sm border border-black/5 ring-1 ring-[#20D47A]/30'
                : 'text-[#50635B] hover:text-[#101513]'
            }`}
            id="tab-scanner-camera"
          >
            <Camera className="w-4 h-4 text-[#20D47A]" />
            Live Camera Scan
          </button>
        </div>

        {mode === 'camera' && isCameraActive && (
          <button
            type="button"
            onClick={toggleCameraFacing}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#073B2A] bg-[#F0F5F2] hover:bg-[#E2EDE7] px-3 py-2 rounded-xl border border-black/5 transition-colors"
            title="Switch between front and back camera"
          >
            <SwitchCamera className="w-3.5 h-3.5 text-[#20D47A]" />
            Flip Lens ({cameraFacing === 'environment' ? 'Rear' : 'Front'})
          </button>
        )}
      </div>

      {/* Main Scanner Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Target (Upload Dropzone or Camera Viewfinder) */}
        <div className="lg:col-span-7">
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative border-2 border-dashed border-[#D5E0DB] hover:border-[#20D47A] rounded-2xl p-8 sm:p-12 text-center bg-[#F7FAF8] hover:bg-[#F0F5F2] transition-colors cursor-pointer group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="qr-file-input"
                aria-label="Upload QR code image file"
              />

              <div className="w-16 h-16 rounded-2xl bg-white border border-[#20D47A]/30 flex items-center justify-center text-[#20D47A] mx-auto mb-4 group-hover:scale-105 group-hover:border-[#20D47A] transition-all shadow-xs">
                {isProcessing ? (
                  <RefreshCw className="w-8 h-8 text-[#20D47A] animate-spin" />
                ) : (
                  <FileImage className="w-8 h-8 text-[#073B2A]" />
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#101513] mb-1">
                Drop your QR image here or click to browse
              </h3>
              <p className="text-xs sm:text-sm text-[#7D9187] max-w-sm mx-auto mb-3">
                Supports PNG, JPEG, WEBP, SVG screenshots, or press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 font-mono text-xs text-[#101513]">
                  Ctrl+V
                </kbd>{' '}
                to paste from clipboard.
              </p>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#073B2A] bg-[#20D47A]/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#105B38]" />
                Instant Local Decoding
              </span>
            </div>
          ) : (
            /* Live Camera Viewfinder */
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-4/3 flex items-center justify-center border border-black/10 shadow-inner">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Overlay */}
              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  {/* Targeting frame corners */}
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 border-2 border-[#20D47A]/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(32,212,122,0.2)]">
                    {/* Laser scanner line */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#54F5A0] to-transparent shadow-[0_0_15px_#20D47A] animate-[bounce_2.5s_infinite]" />

                    {/* Corner marks */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#20D47A]" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#20D47A]" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#20D47A]" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#20D47A]" />
                  </div>

                  <p className="mt-4 text-xs font-medium text-white/90 bg-black/60 backdrop-blur-sm px-3.5 py-1 rounded-full border border-white/10">
                    Align QR code within the frame
                  </p>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-black/90 text-white">
                  <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                  <p className="text-sm font-semibold mb-2">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-2 text-xs font-bold text-[#020B08] bg-[#20D47A] hover:bg-[#54F5A0] px-4 py-2 rounded-xl transition-colors"
                  >
                    Retry Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Scan Result Card & Actions */}
        <div className="lg:col-span-5 h-full">
          <div className="p-6 rounded-2xl bg-[#F7FAF8] border border-black/5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#101513] uppercase tracking-wider">
                  Decoded Content
                </span>
                {scanResult ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#073B2A] bg-[#20D47A]/20 px-2.5 py-0.5 rounded-full border border-[#20D47A]/30">
                    <Check className="w-3 h-3 text-[#105B38]" />
                    Successfully Decoded
                  </span>
                ) : (
                  <span className="text-xs text-[#7D9187]">Waiting for scan...</span>
                )}
              </div>

              {scanResult ? (
                <div className="space-y-4">
                  {/* Type Badge & Summary */}
                  <div className="p-4 rounded-xl bg-white border border-black/5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#F0F5F2] flex items-center justify-center">
                        {getResultIcon(scanResult.type)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#20D47A] uppercase tracking-wider block">
                          Format: {scanResult.type}
                        </span>
                        <h4 className="text-sm font-bold text-[#101513]">
                          {scanResult.parsedSummary}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata breakdown if available */}
                    {scanResult.metadata && Object.keys(scanResult.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-black/5 space-y-1">
                        {Object.entries(scanResult.metadata).map(([key, val]) => (
                          <div key={key} className="flex items-start justify-between text-xs">
                            <span className="text-[#7D9187] font-medium">{key}:</span>
                            <span className="text-[#101513] font-semibold text-right max-w-[65%] truncate">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Raw Content Viewer */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#50635B] uppercase tracking-wider mb-1.5">
                      Raw Payload String
                    </label>
                    <div className="p-3 rounded-xl bg-white border border-black/5 font-mono text-xs text-[#101513] break-all max-h-36 overflow-y-auto select-all">
                      {scanResult.raw}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#7D9187]">
                  <QrCode className="w-12 h-12 text-[#D5E0DB] mx-auto mb-3" />
                  <p className="text-xs sm:text-sm font-medium text-[#50635B]">
                    No QR code scanned yet
                  </p>
                  <p className="text-xs text-[#7D9187] mt-1">
                    Upload an image or point your camera at any QR code to instantly read its content.
                  </p>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            {scanResult && (
              <div className="pt-6 mt-6 border-t border-black/5 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(scanResult.raw)}
                    className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#F0F5F2] text-[#073B2A] font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-[#D5E0DB] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-[#20D47A]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#7D9187]" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  {/* Open Link if URL */}
                  {scanResult.type === 'url' ? (
                    <a
                      href={scanResult.raw.startsWith('http') ? scanResult.raw : `https://${scanResult.raw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-[#073B2A] hover:bg-[#105B38] text-white font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[#20D47A]" />
                      <span>Open Link</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setScanResult(null);
                        if (mode === 'camera') startCamera();
                      }}
                      className="flex items-center justify-center gap-1.5 bg-[#073B2A] hover:bg-[#105B38] text-white font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-[#20D47A]" />
                      <span>Scan Next</span>
                    </button>
                  )}
                </div>

                {/* Transfer to Generator Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (scanResult.suggestedConfig) {
                      onLoadIntoGenerator(scanResult.suggestedConfig);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-[#20D47A]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#073B2A]" />
                  <span>Customize & Redesign in Generator</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
