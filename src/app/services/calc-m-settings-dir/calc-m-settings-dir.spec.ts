import { TestBed } from '@angular/core/testing';

import { CalcMSettingsDir } from './calc-m-settings-dir';

describe('CalcMSettingsDir', () => {
  let service: CalcMSettingsDir;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcMSettingsDir);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
