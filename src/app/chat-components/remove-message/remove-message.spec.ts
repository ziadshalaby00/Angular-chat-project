import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMessage } from './remove-message';

describe('RemoveMessage', () => {
  let component: RemoveMessage;
  let fixture: ComponentFixture<RemoveMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
