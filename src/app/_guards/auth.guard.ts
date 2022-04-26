import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  /**
   * 
   */
  canActivate(): boolean {
    // console.log('guard works');
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.alertify.error('Unauthorize');
    return false;
  }
}
