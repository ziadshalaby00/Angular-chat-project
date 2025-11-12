import { TestBed } from '@angular/core/testing';

import { SharedUtils } from './shared-utils';

describe('SharedUtils', () => {
  let service: SharedUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
