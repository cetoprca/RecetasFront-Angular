import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StepDTO } from "../../model/step/step-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StepService {
  private baseUrl = `${environment.apiUrl}/recipe`;

  constructor(private http: HttpClient) {}

  getStepsByRecipeId(recipeId: number): Observable<StepDTO[]> {
    return this.http.get<StepDTO[]>(`${this.baseUrl}/${recipeId}/step`, { withCredentials: true });
  }

  getStepById(recipeId: number, stepId: number): Observable<StepDTO> {
    return this.http.get<StepDTO>(`${this.baseUrl}/${recipeId}/step/${stepId}`, { withCredentials: true });
  }

  saveStep(recipeId: number, step: StepDTO): Observable<StepDTO> {
    return this.http.post<StepDTO>(`${this.baseUrl}/${recipeId}/step`, step, { withCredentials: true });
  }

  updateStep(recipeId: number, step: StepDTO): Observable<StepDTO> {
    return this.http.patch<StepDTO>(`${this.baseUrl}/${recipeId}/step`, step, { withCredentials: true });
  }

  deleteStep(recipeId: number, stepId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${recipeId}/step/${stepId}`, { withCredentials: true });
  }
}