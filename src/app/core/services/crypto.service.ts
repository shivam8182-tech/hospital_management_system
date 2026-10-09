import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

/**
 * Encrypts identifiers before putting them into the URL.
 * IMPORTANT: A browser-only key is not a complete security boundary.
 * Real PHI/PII protection must also be enforced by the backend and authorization layer.
 */
@Injectable({ providedIn: 'root' })
export class CryptoService {
  private readonly secret = 'HMS-DEMO-KEY-CHANGE-IN-PRODUCTION';

  encrypt(value: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.secret).toString());
  }

  decrypt(value: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(value), this.secret);
      const result = bytes.toString(CryptoJS.enc.Utf8);
      return result || null;
    } catch {
      return null;
    }
  }
}