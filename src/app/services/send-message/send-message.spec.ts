import { TestBed } from '@angular/core/testing';

import { SendMessage } from './send-message';

describe('SendMessage', () => {
  let service: SendMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendMessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
