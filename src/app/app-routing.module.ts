import { TestPageComponent } from './test-page/test-page.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewIssueComponent } from './editor/new-issue/new-issue.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProjectMatrixComponent } from './project-matrix/project-matrix/project-matrix.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'new-issue', component: NewIssueComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  { path: 'issue/:issueNo', component: HomeComponent },
  { path: 'project-list', component: ProjectListComponent },
  { path: 'project-matrix', component: ProjectMatrixComponent },
  { path: 'test-page', component: TestPageComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
