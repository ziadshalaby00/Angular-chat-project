import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconContainer } from './icon-container';

describe('IconContainer', () => {
  let component: IconContainer;
  let fixture: ComponentFixture<IconContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
