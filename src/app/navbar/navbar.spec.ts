import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComp } from './navbar';

describe('Navbar', () => {
  let component: NavbarComp;
  let fixture: ComponentFixture<NavbarComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
