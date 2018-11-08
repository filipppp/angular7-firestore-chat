import { TestBed, async, inject } from '@angular/core/testing';

import { AlreadyloggedGuard } from './alreadylogged.guard';

describe('AlreadyloggedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlreadyloggedGuard]
    });
  });

  it('should ...', inject([AlreadyloggedGuard], (guard: AlreadyloggedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
