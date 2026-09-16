import QRCode from 'qrcode';
import { QRConfig, ContentType, QRSizePreset } from '../types';

export const QR_SIZE_MAP: Record<QRSizePreset, number> = {
  small: 320,
  medium: 512,
  large: 800,
  xlarge: 1200,
};

export function formatQRContent(config: QRConfig): string {
  switch (config.contentType) {
    case 'url': {
      const trimmed = config.url.trim();
      if (!trimmed) return '';
      if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('//')) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }
    case 'text':
      return config.text.trim();
    case 'email': {
      const email = config.email.address.trim();
      if (!email) return '';
      const params = new URLSearchParams();
      if (config.email.subject.trim()) params.append('subject', config.email.subject.trim());
      if (config.email.body.trim()) params.append('body', config.email.body.trim());
      const query = params.toString();
      return `mailto:${email}${query ? `?${query}` : ''}`;
    }
    case 'phone': {
      const cleanPhone = config.phone.trim();
      return cleanPhone ? `tel:${cleanPhone}` : '';
    }
    case 'wifi': {
      const ssid = config.wifi.ssid.replace(/([\\;,":])/g, '\\$1');
      const pass = config.wifi.password.replace(/([\\;,":])/g, '\\$1');
      const enc = config.wifi.encryption;
      const hidden = config.wifi.hidden ? 'H:true;' : '';
      return `WIFI:T:${enc};S:${ssid};P:${pass};${hidden};`;
    }
    case 'vcard': {
      const { firstName, lastName, organization, title, phone, email, url } = config.vcard;
      const parts = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName || ''};${firstName || ''};;;`,
        `FN:${`${firstName} ${lastName}`.trim()}`,
      ];
      if (organization) parts.push(`ORG:${organization}`);
      if (title) parts.push(`TITLE:${title}`);
      if (phone) parts.push(`TEL;TYPE=CELL:${phone}`);
      if (email) parts.push(`EMAIL:${email}`);
      if (url) parts.push(`URL:${url}`);
      parts.push('END:VCARD');
      return parts.join('\n');
    }
    default:
      return '';
  }
}

export async function generateQRDataUrl(
  text: string,
  options: {
    size?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    fgColor?: string;
    bgColor?: string;
    transparentBg?: boolean;
    margin?: number;
  }
): Promise<string> {
  const {
    size = 512,
    errorCorrectionLevel = 'M',
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    transparentBg = false,
    margin = 2,
  } = options;

  return QRCode.toDataURL(text || 'https://qrforge.dev', {
    width: size,
    margin,
    errorCorrectionLevel,
    color: {
      dark: fgColor,
      light: transparentBg ? '#00000000' : bgColor,
    },
  });
}

export async function generateQRSVG(
  text: string,
  options: {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    fgColor?: string;
    bgColor?: string;
    transparentBg?: boolean;
    margin?: number;
  }
): Promise<string> {
  const {
    errorCorrectionLevel = 'M',
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    transparentBg = false,
    margin = 2,
  } = options;

  return QRCode.toString(text || 'https://qrforge.dev', {
    type: 'svg',
    margin,
    errorCorrectionLevel,
    color: {
      dark: fgColor,
      light: transparentBg ? '#00000000' : bgColor,
    },
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadQRPNG(
  dataUrl: string,
  filename = 'qr-code.png'
) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  downloadBlob(blob, filename);
}

export function downloadQRSVG(
  svgString: string,
  filename = 'qr-code.svg'
) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

const LOCAL_STORAGE_KEY = 'qrforge_recent_codes_v1';

export function getRecentQRCodes(): import('../types').RecentQRItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse recent QR codes:', err);
    return [];
  }
}

export function saveRecentQRCode(item: import('../types').RecentQRItem): import('../types').RecentQRItem[] {
  try {
    const current = getRecentQRCodes();
    // Filter duplicates by rawContent or id
    const filtered = current.filter(i => i.rawContent !== item.rawContent && i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 6); // Keep last 6
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save recent QR code:', err);
    return [];
  }
}

export function clearRecentQRCodes(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear recent QR codes:', err);
  }
}

export function deleteRecentQRCode(id: string): import('../types').RecentQRItem[] {
  try {
    const current = getRecentQRCodes();
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete recent QR code:', err);
    return [];
  }
}
