import { TestBed } from '@angular/core/testing';
import { ChatsCallService } from './chats-call-service';

describe('ChatsCallService', () => {
  let service: ChatsCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
