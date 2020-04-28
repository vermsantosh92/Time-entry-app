import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthSingupSerive } from '../auth/signup/auth-singup.service';



@Component({
     selector : 'app-header',
     templateUrl : './header.component.html',
     styleUrls : ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false
  private authListnerSub : Subscription;

  constructor(private authService : AuthSingupSerive){}

  ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuth()
       this.authListnerSub = this.authService.getAuthStatusListner().subscribe(isAuthenticated=>{
          this.userIsAuthenticated = isAuthenticated

       })

  }

  mylogout(){
     this.authService.onlogout()
  }

   ngOnDestroy(){
           this.authListnerSub.unsubscribe()
   }
}
