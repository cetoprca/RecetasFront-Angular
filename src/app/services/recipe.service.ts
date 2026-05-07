import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RecipeDTO } from "../../model/recipe/recipe-dto";
import { RecipeCardDTO } from "../../model/recipe/recipe-card-dto";
import { FilterDTO } from "../../model/filter/filter-dto";
import { RecipeFilterRequest } from "../../model/recipe/recipe-filter-request";
import { PaginationDTO } from "../../model/pagination/pagination-dto";
import { PageResponse } from "../../model/page-response";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.apiUrl}/recipe`;

  constructor(private http: HttpClient) {}

  getFilteredRecipes(request: RecipeFilterRequest): Observable<PageResponse<RecipeCardDTO>> {
    return this.http.post<PageResponse<RecipeCardDTO>>(`${this.baseUrl}/filter`, request, { withCredentials: true });
  }

  getRecipesByUser(userId: number, pagination: PaginationDTO): Observable<PageResponse<RecipeCardDTO>> {
    return this.http.post<PageResponse<RecipeCardDTO>>(`${this.baseUrl}/byUser/${userId}`, pagination, { withCredentials: true });
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