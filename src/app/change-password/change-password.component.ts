import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  loginForm: FormGroup;
  user: any = {};

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  getLoginInfo() {
    this.user = {
      username: this.loginForm.get('username').value,
      oldPassword: this.loginForm.get('oldPassword').value,
      newPassword: this.loginForm.get('newPassword').value,
      confirmPassword: this.loginForm.get('confirmPassword').value
    };
  }
  checkPassword() {
    if (
      this.loginForm.get('newPassword').dirty &&
      this.loginForm.get('confirmPassword').dirty
    ) {
      if (
        this.loginForm.get('newPassword').value !==
        this.loginForm.get('confirmPassword').value
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  changePassword() {
    this.getLoginInfo();
    if (this.user.newPassword !== this.user.oldPassword) {
      this.alertify.error('Passwords do not match!');
    }
    this.authService.changePassword(this.user).subscribe(
      next => {
        this.alertify.success('Password Changed');
        this.router.navigate(['/home']);
      },
      error => {
        this.alertify.error('Unauthorized');
      }
    );
  }
  checkInfo() {
    if (
      this.loginForm.get('username').value === '' ||
      this.loginForm.get('oldPassword').value === '' ||
      this.loginForm.get('newPassword').value === '' ||
      this.loginForm.get('confirmPassword').value === ''
    ) {
      return true;
    } else {
      return false;
    }
  }
}
