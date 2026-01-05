import { TestBed } from '@angular/core/testing';

import { UserSharedUtils } from './user-shared-utils';

describe('UserSharedUtils', () => {
  let service: UserSharedUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSharedUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
