import { IssueService } from '../_services/issue.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertifyService } from '../_services/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  baseUrl = environment.baseUrl;
  user: any = {};
  showMenu: any = false;
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private issueService: IssueService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.currentUserAccount.subscribe(x => (this.user = x));
    this.createLoginForm();
    this.authService.isLoggedIn();
    this.issueService.loadNewIssue();

  }
  loadNewIssueComp() {
    this.issueService.loadNewIssue();
  }
  loadAdvanceSearch(){
    this.issueService.loadAdvanceSearch();
  }

  loggedIn() {
    if (this.user) {
      if (this.user.isLoggedIn) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  toggle() {
    console.log(this.showMenu);
    this.showMenu = !this.showMenu;
  }
  signOut() {
    this.authService.signOut();
  }
  getLoginInfo() {
    this.user = {
      username: this.loginForm.get('username').value.toLowerCase(),
      password: this.loginForm.get('password').value
    };
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  login() {
    this.getLoginInfo();
    console.log(this.user);
    this.authService.login(this.user).subscribe(
      next => {
        this.alertify.success('Logged in successfully');
        this.loginForm.get('username').setValue('');
        this.loginForm.get('password').setValue('');
      },
      error => {
        this.alertify.error('Unauthorized');
      }
    );
  }
}
