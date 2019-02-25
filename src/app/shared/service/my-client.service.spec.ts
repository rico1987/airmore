import { TestBed } from '@angular/core/testing';

import { MyClientService } from './my-client.service';

describe('MyClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyClientService = TestBed.get(MyClientService);
    expect(service).toBeTruthy();
  });
});
