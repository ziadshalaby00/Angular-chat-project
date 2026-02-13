import { TestBed } from '@angular/core/testing';

import { OverflowCard } from './overflow-card';

describe('OverflowCard', () => {
  let service: OverflowCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverflowCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
