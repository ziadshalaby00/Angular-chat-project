import { TestBed } from '@angular/core/testing';

import { AccessVerification } from './access-verification';

describe('AccessVerification', () => {
  let service: AccessVerification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessVerification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
