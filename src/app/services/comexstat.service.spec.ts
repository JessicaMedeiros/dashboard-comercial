import { TestBed } from '@angular/core/testing';

import { ComexstatService } from './comexstat.service';

describe('ComexstatService', () => {
  let service: ComexstatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComexstatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
