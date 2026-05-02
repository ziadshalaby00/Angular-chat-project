import { TestBed } from '@angular/core/testing';

import { CompressFiles } from './compress-files';

describe('CompressFiles', () => {
  let service: CompressFiles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompressFiles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
