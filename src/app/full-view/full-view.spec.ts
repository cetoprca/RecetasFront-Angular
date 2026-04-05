import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullView } from './full-view';

describe('FullView', () => {
  let component: FullView;
  let fixture: ComponentFixture<FullView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
