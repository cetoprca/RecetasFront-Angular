import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserDTO } from "../../model/user/user-dto";
import { CredentialsDTO } from "../../model/auth/credentials-dto";
import { environment } from "../../environments/environment";
import { RecipeCardDTO } from "../../model/recipe/recipe-card-dto";
import { PaginationDTO } from "../../model/pagination/pagination-dto";
import { PageResponse } from "../../model/page-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUserById(handle: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${handle}`, { withCredentials: true });
  }

  checkHandleAvailability(handle: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.baseUrl}/exists/${handle}`);
  }

  register(credentials: CredentialsDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/register`, {
      handle: credentials.handle,
      password: credentials.password,
      displayName: credentials.displayName
    }, { withCredentials: true });
  }

  updateUser(user: UserDTO): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}`, user, { withCredentials: true });
  }

  deleteUser(handle: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${handle}`, { withCredentials: true });
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/logged`, { withCredentials: true });
  }

  saveRecipe(recipeID: number): Observable<UserDTO>{
    return this.http.post<UserDTO>(`${this.baseUrl}/save/${recipeID}`, {}, {withCredentials: true});
  }

  getSavedRecipes(pagination: PaginationDTO): Observable<PageResponse<RecipeCardDTO>> {
    return this.http.post<PageResponse<RecipeCardDTO>>(`${this.baseUrl}/savedRecipes`, pagination, { withCredentials: true });
  }

  toggleFollow(userHandle: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/follow/${userHandle}`, {}, { withCredentials: true });
  }
}