import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserToken} from "../model/user-token";
import {AuthenticationService} from "../service/authentication.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    // this.authService.currentUser.subscribe(
    //     (currentUser: any) => {
    //     this.currentUser = currentUser;
    //   }
    // );
    this.currentUser = localStorage.getItem('currentUser');
    console.log(this.currentUser)

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUser != null) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
