import { IssueFileListComponent } from './issue-file/issue-file-list/issue-file-list.component';
import { IssueFileUploaderComponent } from './issue-file/issue-file-uploader/issue-file-uploader.component';
import { ActionPostsComponent } from './issue-list-main/action-posts/action-posts.component';
import { ActionPostComponent } from './issue-list-main/action-post/action-post.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { EcbomPostsComponent } from './issue-list-main/ecbom-posts/ecbom-posts.component';
import { FlagPartPostsComponent } from './issue-list-main/flag-part-posts/flag-part-posts.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IssueFilterComponent } from './filters/issue-filter/issue-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewIssueComponent } from './editor/new-issue/new-issue.component';
import {MatMenuModule} from '@angular/material/menu';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { IssueEditorComponent } from './editor/issue-editor/issue-editor.component';
import { ActionEditorComponent } from './editor/action-editor/action-editor.component';
import { MatSortModule } from '@angular/material/sort';
import { IssuePostsComponent } from './issue-list-main/issue-posts/issue-posts.component';
import { PostComponent } from './issue-list-main/post/post.component';
import { MyActionComponent } from './my-action/my-action.component';
import { IssueFlagComponent } from './editor/issue-flag/issue-flag.component';
import { FlagPartPostComponent } from './issue-list-main/flag-part-post/flag-part-post.component';
import { EcbomPostComponent } from './issue-list-main/ecbom-post/ecbom-post.component';
import { TestPageComponent } from './test-page/test-page.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AdvanceIssueFilterComponent } from './filters/advance-issue-filter/advance-issue-filter.component';
import { IssueMatrixComponent } from './issue-list-main/issue-matrix/issue-matrix.component';
import { SubProjectPostComponent } from './issue-list-main/sub-project-post/sub-project-post.component';
import { ActionPipe } from './pipe/action.pipe';
import { SubProjectActionsComponent } from './issue-list-main/sub-project-actions/sub-project-actions.component';
import { ProjectMatrixComponent } from './project-matrix/project-matrix/project-matrix.component';
import { SubProjectPipe } from './pipe/subProject.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionTemplateComponent } from './issue-list-main/action-template/action-template.component';
import { MaterialTemplateComponent } from './issue-list-main/action-templates/material-template/material-template.component';
import { SitTemplateComponent } from './issue-list-main/action-templates/sit-template/sit-template.component';
import { MechTemplateComponent } from './issue-list-main/action-templates/mech-template/mech-template.component';
import { ElecTemplateComponent } from './issue-list-main/action-templates/elec-template/elec-template.component';

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      IssueFilterComponent,
      NewIssueComponent,
      HomeComponent,
      ChangePasswordComponent,
      IssueEditorComponent,
      IssueEditorComponent,
      ActionEditorComponent,
      IssuePostsComponent,
      PostComponent,
      MyActionComponent,
      IssueFlagComponent,
      FlagPartPostComponent,
      FlagPartPostsComponent,
      EcbomPostsComponent,
      EcbomPostComponent,
      ProjectListComponent,
      ActionPostComponent,
      ActionPostsComponent,
      TestPageComponent,
      IssueFileUploaderComponent,
      IssueFileListComponent,
      AdvanceIssueFilterComponent,
      IssueMatrixComponent,
      SubProjectPostComponent,
      ActionPipe,
      SubProjectActionsComponent,
      ProjectMatrixComponent,
      SubProjectPipe,
      ActionTemplateComponent,
      MaterialTemplateComponent,
      SitTemplateComponent,
      MechTemplateComponent,
      ElecTemplateComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatTableModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      MatMenuModule,
      NgbModule,
      MatSortModule,
      FileUploadModule,
      MatTooltipModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
