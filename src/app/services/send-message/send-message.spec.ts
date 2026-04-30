import { TestBed } from '@angular/core/testing';

import { SendMessageService } from './send-message';

describe('SendMessageService', () => {
  let service: SendMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
