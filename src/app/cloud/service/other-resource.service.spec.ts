import { TestBed } from '@angular/core/testing';

import { OtherResourceService } from './other-resource.service';

describe('OtherResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherResourceService = TestBed.get(OtherResourceService);
    expect(service).toBeTruthy();
  });
});
