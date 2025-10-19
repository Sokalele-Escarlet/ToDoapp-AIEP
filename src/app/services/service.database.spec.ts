import { TestBed } from '@angular/core/testing';

import { ServiceDatabase } from './service.database';

describe('ServiceDatabase', () => {
  let service: ServiceDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDatabase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});