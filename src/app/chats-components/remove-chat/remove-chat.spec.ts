import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveChat } from './remove-chat';

describe('RemoveChat', () => {
  let component: RemoveChat;
  let fixture: ComponentFixture<RemoveChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
