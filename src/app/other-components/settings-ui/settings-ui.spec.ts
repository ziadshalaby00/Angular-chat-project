import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUi } from './settings-ui';

describe('SettingsUi', () => {
  let component: SettingsUi;
  let fixture: ComponentFixture<SettingsUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
