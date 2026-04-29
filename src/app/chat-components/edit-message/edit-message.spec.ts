import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessage } from './edit-message';

describe('EditMessage', () => {
  let component: EditMessage;
  let fixture: ComponentFixture<EditMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
