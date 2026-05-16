import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { RatingDTO } from "../../model/rating/rating-dto";
import { RatingCardDTO } from "../../model/rating/rating-card-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = `${environment.apiUrl}/recipe`;

  private currentRatingsSubject = new BehaviorSubject<RatingCardDTO[]>([]);
  currentRatings$ = this.currentRatingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  setCurrentRatings(ratings: RatingCardDTO[]): void {
    this.currentRatingsSubject.next(ratings);
  }

  getRatingsByRecipeId(recipeId: number): Observable<RatingDTO[]> {
    return this.http.get<RatingDTO[]>(`${this.baseUrl}/${recipeId}/rating`, { withCredentials: true });
  }

  getRatingCardsByRecipeId(recipeId: number): Observable<RatingCardDTO[]> {
    return this.http.get<RatingCardDTO[]>(`${this.baseUrl}/${recipeId}/rating/card`, { withCredentials: true });
  }

  getRatingById(recipeId: number, ratingId: number): Observable<RatingDTO> {
    return this.http.get<RatingDTO>(`${this.baseUrl}/${recipeId}/rating/${ratingId}`, { withCredentials: true });
  }

  createRating(recipeId: number, rating: RatingDTO): Observable<RatingDTO> {
    return this.http.post<RatingDTO>(`${this.baseUrl}/${recipeId}/rating`, rating, { withCredentials: true });
  }

  updateRating(recipeId: number, rating: RatingDTO): Observable<RatingDTO> {
    return this.http.patch<RatingDTO>(`${this.baseUrl}/${recipeId}/rating`, rating, { withCredentials: true });
  }

  deleteRating(recipeId: number, ratingId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${recipeId}/rating/${ratingId}`, { withCredentials: true });
  }
}
