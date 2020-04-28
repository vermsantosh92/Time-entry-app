import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable} from 'rxjs';
import { AuthSingupSerive } from './auth-singup.service';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthGuard implements CanActivate{

  constructor(private authService : AuthSingupSerive, private router : Router){}

  canActivate(
    route: import("@angular/router").ActivatedRouteSnapshot,
    state: import("@angular/router").RouterStateSnapshot): boolean |
     import("@angular/router").UrlTree | import("rxjs").Observable<boolean |
     import("@angular/router").UrlTree> | Promise<boolean |
     import("@angular/router").UrlTree> {
       const isAuht = this.authService.getIsAuth()
       if(!isAuht){
         this.router.navigate['/login']
       }
   return isAuht;
  }

}
