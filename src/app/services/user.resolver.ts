import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDTO } from '../../model/user/user-dto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserDTO> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserDTO> {
    const userId = route.paramMap.get('userId');
    if (userId) {
      return this.userService.getUserById(+userId);
    }
    return this.userService.getCurrentUser();
  }
}
