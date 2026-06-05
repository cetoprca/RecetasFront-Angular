import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IngredientDTO } from "../../model/ingredient/ingredient-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = `${environment.apiUrl}/ingredient`;

  constructor(private http: HttpClient) {}

  getAllIngredients(): Observable<IngredientDTO[]> {
    return this.http.get<IngredientDTO[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  createIngredient(ingredient: IngredientDTO): Observable<IngredientDTO> {
    return this.http.post<IngredientDTO>(`${this.baseUrl}`, ingredient, { withCredentials: true });
  }

  updateIngredient(ingredient: IngredientDTO): Observable<IngredientDTO> {
    return this.http.patch<IngredientDTO>(`${this.baseUrl}`, ingredient, { withCredentials: true });
  }

  deleteIngredient(ingredientId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${ingredientId}`, { withCredentials: true });
  }
}
