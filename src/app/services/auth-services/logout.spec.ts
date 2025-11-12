import { TestBed } from '@angular/core/testing';

import { Logout } from './logout';

describe('Logout', () => {
  let service: Logout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Logout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
