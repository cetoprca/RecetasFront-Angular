import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RecipeDTO } from "../../model/recipe/recipe-dto";
import { RecipeCardDTO } from "../../model/recipe/recipe-card-dto";
import { FilterDTO } from "../../model/filter/filter-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.apiUrl}/recipe`;

  constructor(private http: HttpClient) {}

  getFilteredRecipes(filter: FilterDTO): Observable<RecipeCardDTO[]> {
    return this.http.post<RecipeCardDTO[]>(`${this.baseUrl}/filter`, filter, { withCredentials: true });
  }

  getSavedRecipes(): Observable<RecipeCardDTO[]> {
    return this.http.get<RecipeCardDTO[]>(`${this.baseUrl}/user/saved`, { withCredentials: true });
  }

  getRecipeById(id: number): Observable<RecipeCardDTO> {
    return this.http.get<RecipeCardDTO>(`${this.baseUrl}/card/${id}`, { withCredentials: true });
  }

  saveRecipe(recipe: RecipeDTO): Observable<RecipeDTO> {
    return this.http.post<RecipeDTO>(`${this.baseUrl}`, recipe, { withCredentials: true });
  }

  updateRecipe(recipe: RecipeDTO): Observable<RecipeDTO> {
    return this.http.patch<RecipeDTO>(`${this.baseUrl}`, recipe, { withCredentials: true });
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}