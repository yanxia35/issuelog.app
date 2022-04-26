
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  private userAccount = new BehaviorSubject({});
  currentUserAccount = this.userAccount.asObservable();

  constructor(private http: HttpClient) { }

  login(user: any) {
    return this.http.post(this.baseUrl + 'loginpartcatalog', user).pipe(
      map((response: any) => {
        // console.log(response);
        if (response) {
          const claims = this.jwtHelper.decodeToken(response.token);
          if (claims) {
            // console.log(claims);
            this.changeStatus({
              username: claims.unique_name,
              id: claims.nameid,
              canEdit: claims.roles === 'admin' ? true : false,
              isLoggedIn: true
            });
          }
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
  changePassword(user: any) {
    return this.http
      .post(this.baseUrl + 'changepassword', {
        username: user.username,
        oldPassword: user.oldPassword,
        newPassword: user.newPassword
      })
      .pipe(
        map((response: any) => {
          // console.log(response);
          if (response) {
            const claims = this.jwtHelper.decodeToken(response.token);
            if (claims) {
              // console.log(claims);
              this.changeStatus({
                username: claims.unique_name,
                id: claims.nameid,
                canEdit: claims.roles === 'admin' ? true : false,
                isLoggedIn: true
              });
            }
            localStorage.setItem('token', response.token);
          }
        })
      );
  }
  changeStatus(userAccount: any) {
    // console.log(userAccount);
    this.userAccount.next(userAccount);
  }
  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem('token');
        return false;
      } else {
        const claims = this.jwtHelper.decodeToken(token);
        this.changeStatus({
          username: claims.unique_name,
          id: claims.nameid,
          canEdit: claims.roles === 'admin' ? true : false,
          isLoggedIn: !this.jwtHelper.isTokenExpired(token)
        });
        return true;
      }
    }
    return false;
  }
  signOut() {
    localStorage.removeItem('token');
    this.changeStatus({});
  }
}
