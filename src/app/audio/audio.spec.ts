import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Audio } from './audio';

describe('Audio', () => {
  let component: Audio;
  let fixture: ComponentFixture<Audio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Audio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Audio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
