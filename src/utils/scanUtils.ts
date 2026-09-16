import jsQR from 'jsqr';
import { QRConfig, ContentType } from '../types';

export interface ScanResult {
  raw: string;
  type: ContentType;
  parsedSummary: string;
  metadata?: Record<string, string>;
  suggestedConfig?: Partial<QRConfig>;
}

export function parseDecodedQR(raw: string): ScanResult {
  const trimmed = raw.trim();

  // 1. Wi-Fi
  if (/^WIFI:/i.test(trimmed)) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);

    const ssid = ssidMatch ? ssidMatch[1].replace(/\\([\\;,":])/g, '$1') : '';
    const pass = passMatch ? passMatch[1].replace(/\\([\\;,":])/g, '$1') : '';
    const enc = (typeMatch ? typeMatch[1] : 'WPA') as 'WPA' | 'WEP' | 'nopass';

    return {
      raw,
      type: 'wifi',
      parsedSummary: `Wi-Fi Network: "${ssid}"`,
      metadata: {
        Network: ssid,
        Password: pass ? '••••••••' : '(None)',
        Security: enc,
      },
      suggestedConfig: {
        contentType: 'wifi',
        wifi: {
          ssid,
          password: pass,
          encryption: enc,
          hidden: false,
        },
      },
    };
  }

  // 2. Email (mailto:)
  if (/^mailto:/i.test(trimmed)) {
    const withoutPrefix = trimmed.replace(/^mailto:/i, '');
    const [addressPart, queryPart] = withoutPrefix.split('?');
    const params = new URLSearchParams(queryPart || '');
    const subject = params.get('subject') || '';
    const body = params.get('body') || '';

    return {
      raw,
      type: 'email',
      parsedSummary: `Email to ${addressPart}`,
      metadata: {
        To: addressPart,
        Subject: subject || '(None)',
        Body: body || '(None)',
      },
      suggestedConfig: {
        contentType: 'email',
        email: {
          address: addressPart,
          subject,
          body,
        },
      },
    };
  }

  // 3. Phone (tel:)
  if (/^tel:/i.test(trimmed)) {
    const phone = trimmed.replace(/^tel:/i, '');
    return {
      raw,
      type: 'phone',
      parsedSummary: `Phone Number: ${phone}`,
      metadata: {
        Number: phone,
      },
      suggestedConfig: {
        contentType: 'phone',
        phone,
      },
    };
  }

  // 4. vCard
  if (/BEGIN:VCARD/i.test(trimmed)) {
    const fnMatch = trimmed.match(/FN:(.+)/i);
    const telMatch = trimmed.match(/TEL[^:]*:(.+)/i);
    const emailMatch = trimmed.match(/EMAIL[^:]*:(.+)/i);
    const orgMatch = trimmed.match(/ORG:(.+)/i);
    const titleMatch = trimmed.match(/TITLE:(.+)/i);
    const urlMatch = trimmed.match(/URL:(.+)/i);

    const fullName = fnMatch ? fnMatch[1].trim() : 'Contact';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      raw,
      type: 'vcard',
      parsedSummary: `Contact: ${fullName}`,
      metadata: {
        Name: fullName,
        Phone: telMatch ? telMatch[1].trim() : '',
        Email: emailMatch ? emailMatch[1].trim() : '',
        Organization: orgMatch ? orgMatch[1].trim() : '',
      },
      suggestedConfig: {
        contentType: 'vcard',
        vcard: {
          firstName,
          lastName,
          organization: orgMatch ? orgMatch[1].trim() : '',
          title: titleMatch ? titleMatch[1].trim() : '',
          phone: telMatch ? telMatch[1].trim() : '',
          email: emailMatch ? emailMatch[1].trim() : '',
          url: urlMatch ? urlMatch[1].trim() : '',
        },
      },
    };
  }

  // 5. URL
  if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
    const normalizedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return {
      raw,
      type: 'url',
      parsedSummary: `Website: ${normalizedUrl}`,
      metadata: {
        URL: normalizedUrl,
      },
      suggestedConfig: {
        contentType: 'url',
        url: normalizedUrl,
      },
    };
  }

  // 6. Plain Text Fallback
  return {
    raw,
    type: 'text',
    parsedSummary: trimmed.length > 60 ? `${trimmed.substring(0, 60)}...` : trimmed,
    metadata: {
      Length: `${trimmed.length} characters`,
    },
    suggestedConfig: {
      contentType: 'text',
      text: trimmed,
    },
  };
}

export function scanImageFile(file: File): Promise<ScanResult | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;

          // Scale down if massive image
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            resolve(parseDecodedQR(code.data));
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
