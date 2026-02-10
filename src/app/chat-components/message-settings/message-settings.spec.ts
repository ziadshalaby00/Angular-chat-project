import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSettings } from './message-settings';

describe('MessageSettings', () => {
  let component: MessageSettings;
  let fixture: ComponentFixture<MessageSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
