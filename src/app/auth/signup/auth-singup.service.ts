import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';



@Injectable({
    providedIn : 'root'
})

  export class AuthSingupSerive{

    private isAuthenticated = false;
    public token : string;
    authStatusListner = new Subject<boolean>();
    private tokenTimer : any;
    private userId : string;

  constructor( public http :  HttpClient, private router : Router){}

  getToken(){
      return this.token;

  }

   getIsAuth(){
     return this.isAuthenticated;
   }

getUserId(){
  return this.userId;
}

  getAuthStatusListner(){
      return this.authStatusListner.asObservable()
  }

   createUser(email : string, password : string){
      const authData : AuthData = {email : email , password : password}
     this.http.post("http://localhost:3000/api/users/signup", authData).subscribe(res=>{
          console.log(res)
     })
   }

   login(email : string , password : string){
        const authdata = {email : email , password : password}
        this.http.post<{token : string, expiresIn : number, userId : string}>("http://localhost:3000/api/users/login", authdata)
        .subscribe((res)=>{
          const token = res.token;
          this.token = token;

          if(token){
            const expiresInDuratin = res.expiresIn;
             this.setAuthTimer(expiresInDuratin)
            this.isAuthenticated = true;
            this.userId = res.userId
            this.authStatusListner.next(true);
            const now = new Date();
            const expiration = new Date(now.getTime() + expiresInDuratin * 1000);
            this.saveAuthData(token, expiration, this.userId )
            this.router.navigate(['/'])
          }

        })
   }

    private setAuthTimer(duration : number){
      this.tokenTimer = setTimeout(()=>{
        this.onlogout()
      },duration * 1000)
    }

     autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
          return
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
        if(expiresIn > 0){
          this.token = authInformation.token;
          this.isAuthenticated = true;
          this.userId = authInformation.userId;
          this.setAuthTimer(expiresIn/1000)
          this.authStatusListner.next(true)
        }
     }

   onlogout(){
     this.token = null;
     this.isAuthenticated = false;
     this.authStatusListner.next(false);
     this.userId = null;
     clearTimeout(this.tokenTimer)
     this.clearAuthData();
     this.router.navigate(['/']);

   }

   private saveAuthData(token : string, expirationDate : Date, userId : string){
     localStorage.setItem("token",token);
     localStorage.setItem("expiratin" , expirationDate.toISOString())
     localStorage.setItem("userId" , userId);
   }

   private clearAuthData(){
     localStorage.removeItem('token');
     localStorage.removeItem('expiratin')
     localStorage.removeItem("userId");
   }

   private getAuthData(){
      const token = localStorage.getItem("token")
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId')
      if(!token || !expirationDate){
        return;
      }
      return {
        token : token,
        expirationDate : new Date(expirationDate),
        userId : userId
      }
   }
}
