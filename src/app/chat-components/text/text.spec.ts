import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Text } from './text';

describe('Text', () => {
  let component: Text;
  let fixture: ComponentFixture<Text>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Text]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Text);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
