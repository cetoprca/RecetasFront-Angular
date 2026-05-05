import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { CredentialsDTO } from "../../model/auth/credentials-dto";
import { UserDTO } from "../../model/user/user-dto";
import { UserService } from "./user.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`;
  currentUser$ = new BehaviorSubject<UserDTO | null>(null);
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient, private userService: UserService) {
    this.checkAuthState();
  }

  login(credentials: CredentialsDTO): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/login`, credentials, { withCredentials: true }).subscribe({
        next: () => {
          this.userService.getCurrentUser().subscribe({
            next: (user) => {
              this.currentUser$.next(user);
              observer.next(user);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
        next: () => {
          this.currentUser$.next(null);
          observer.next(null);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  private checkAuthState() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser$.next(user),
      error: () => this.currentUser$.next(null)
    });
  }
}
