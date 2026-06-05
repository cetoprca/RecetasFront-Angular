import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CuisineDTO } from "../../model/cuisine/cuisine-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CuisineService {
  private baseUrl = `${environment.apiUrl}/recipes/cuisine`;

  constructor(private http: HttpClient) {}

  getAllCuisines(): Observable<CuisineDTO[]> {
    return this.http.get<CuisineDTO[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  createCuisine(cuisine: CuisineDTO): Observable<CuisineDTO> {
    return this.http.post<CuisineDTO>(`${this.baseUrl}`, cuisine, { withCredentials: true });
  }

  updateCuisine(cuisine: CuisineDTO): Observable<CuisineDTO> {
    return this.http.patch<CuisineDTO>(`${this.baseUrl}`, cuisine, { withCredentials: true });
  }

  deleteCuisine(cuisineId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cuisineId}`, { withCredentials: true });
  }
}
