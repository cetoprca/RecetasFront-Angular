import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingView } from './rating-view';

describe('RatingView', () => {
  let component: RatingView;
  let fixture: ComponentFixture<RatingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
