import { Component, Input } from '@angular/core';
import { RatingDTO } from '../../model/rating/rating-dto';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-rating-view',
  standalone: false,
  templateUrl: './rating-view.html',
  styleUrl: './rating-view.css',
})
export class RatingView {
  ratings: RatingDTO[] = [];
  
  constructor(ratingService: RatingService) {
    // create 5 sample RatingDTO objects and initialize ratings
    const r1 = new RatingDTO(1, 'Great recipe', 'I loved it', 5, 'alice', 101);
    const r2 = new RatingDTO(2, 'Good', 'Tasty and simple', 4, 'bob', 102);
    const r3 = new RatingDTO(3, 'Okay', 'Needs more salt', 3, 'carol', 103);
    const r4 = new RatingDTO(4, 'Not great', 'Too spicy for me', 2, 'dave', 104);
    const r5 = new RatingDTO(5, 'Terrible', 'Burnt the dish', 1, 'eve', 105);

    this.ratings = [r1, r2, r3, r4, r5];
  }
}
