import { TestBed } from '@angular/core/testing';

import { GoogleAuth } from './google-auth';

describe('GoogleAuth', () => {
  let service: GoogleAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
