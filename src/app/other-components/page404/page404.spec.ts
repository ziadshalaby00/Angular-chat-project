import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page404Comp } from './page404';

describe('Page404Comp', () => {
  let component: Page404Comp;
  let fixture: ComponentFixture<Page404Comp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page404Comp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Page404Comp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
