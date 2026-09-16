export type ContentType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRSizePreset = 'small' | 'medium' | 'large' | 'xlarge';

export interface QRSizeOption {
  id: QRSizePreset;
  label: string;
  pixels: number;
}

export interface QRConfig {
  contentType: ContentType;
  // Content values
  url: string;
  text: string;
  email: {
    address: string;
    subject: string;
    body: string;
  };
  phone: string;
  wifi: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
  };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    url: string;
  };
  // Styling options
  size: QRSizePreset;
  errorCorrectionLevel: ErrorCorrectionLevel;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  margin: number;
  centerLogo: string; // 'none' | 'link' | 'wifi' | 'mail' | 'star' | custom data URL
}

export interface RecentQRItem {
  id: string;
  title: string;
  contentType: ContentType;
  rawContent: string;
  dataUrl: string;
  timestamp: number;
  config: QRConfig;
}

export interface FAQItem {
  question: string;
  answer: string;
}
