import { TestBed } from '@angular/core/testing';

import { VerifyEmail } from './verify-email';

describe('VerifyEmail', () => {
  let service: VerifyEmail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyEmail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
