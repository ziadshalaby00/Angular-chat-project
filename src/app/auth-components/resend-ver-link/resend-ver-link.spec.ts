import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendVerLink } from './resend-ver-link';

describe('ResendVerLink', () => {
  let component: ResendVerLink;
  let fixture: ComponentFixture<ResendVerLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendVerLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendVerLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
