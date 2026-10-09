import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  it('encrypts and decrypts a value', () => {
    const token = service.encrypt('P1001');
    expect(token).not.toBe('P1001');
    expect(service.decrypt(token)).toBe('P1001');
  });

  it('returns null for invalid ciphertext', () => {
    expect(service.decrypt('invalid-token')).toBeNull();
  });
});