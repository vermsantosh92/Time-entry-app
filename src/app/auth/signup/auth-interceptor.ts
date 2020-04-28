import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthSingupSerive } from './auth-singup.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
   //AuthInterceptor
  constructor(private authService : AuthSingupSerive){}

   intercept(req: HttpRequest<any>, next : HttpHandler){

    const authToken = this.authService.getToken();

    const authRequest = req.clone({
      headers : req.headers.set('authroziation', "Bearer " + authToken)  //authroziation
    })
    return next.handle(authRequest)
   }
}
