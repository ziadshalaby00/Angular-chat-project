import { TestBed } from '@angular/core/testing';

import { PasswordReset } from './password-reset';

describe('PasswordReset', () => {
  let service: PasswordReset;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordReset);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
