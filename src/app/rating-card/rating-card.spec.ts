import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCard } from './rating-card';

describe('RatingCard', () => {
  let component: RatingCard;
  let fixture: ComponentFixture<RatingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
