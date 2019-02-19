import { TestBed } from '@angular/core/testing';

import { QrcodeService } from './qrcode.service';

describe('QrcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QrcodeService = TestBed.get(QrcodeService);
    expect(service).toBeTruthy();
  });
});
