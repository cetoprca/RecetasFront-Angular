import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserDTO } from "../../model/user/user-dto";
import { CredentialsDTO } from "../../model/auth/credentials-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${userId}`, { withCredentials: true });
  }

  register(credentials: CredentialsDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/register`, credentials, { withCredentials: true });
  }

  updateUser(user: UserDTO): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}`, user, { withCredentials: true });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`, { withCredentials: true });
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/logged`, { withCredentials: true });
  }

  saveRecipe(recipeID: number): Observable<UserDTO>{
    return this.http.post<UserDTO>(`${this.baseUrl}/save/${recipeID}`, {}, {withCredentials: true});
  }
}