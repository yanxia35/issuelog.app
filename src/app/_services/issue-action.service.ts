import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from './alertify.service';
import { IssueService } from './issue.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueActionService {
  private actionData = new BehaviorSubject<any>({});
  action = this.actionData.asObservable();
  private actionOwnerData = new BehaviorSubject<any>({});
  actionOwner = this.actionOwnerData.asObservable();
  baseUrl = environment.apiUrl + 'action/';

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService,
    private issueService: IssueService
  ) { }

  selectAction(actionId: any) {
    this.http.get(this.baseUrl + actionId).subscribe(res => {
      if (res !== []) {
        this.actionData.next(res);
        this.alertify.success('Action Switched');
      }
    });
  }
  addAction(action: any, switchEditor: number) {
    let newAction;
    this.http.post(this.baseUrl + 'addaction', action).subscribe(
      res => {
        if (res !== []) {
          this.issueService.addActionToList(res);
          // console.log(res);
          newAction = res;
          this.alertify.success('Action Added');
        }
      },
      error => {
        this.alertify.error(JSON.stringify(error.error));
      }, () => {
        if (switchEditor !== 0) {
          this.selectAction(newAction.id);
          this.issueService.toggleEditor('action');
        }
      }
    );
  }

  saveAction(action: any) {
    this.http.post(this.baseUrl + 'saveaction', action).subscribe(res => {
      this.issueService.updateActionInList(res);
      this.actionData.next(res);
      this.alertify.success('Action Saved');
    }, error => {
      this.alertify.error(JSON.stringify(error.error));
    });
  }
  deleteAction(action: any) {
    return this.http.post(this.baseUrl + 'deleteaction', action).subscribe(res => {
      this.issueService.removeActionInList(action);
      this.actionData.next({});
      this.alertify.warning('Action Removed');
    }, error => {
      this.alertify.error(JSON.stringify(error.error));
    });
  }

  /**
   * 
   * @param condition : Searching condition includes template name and the issue 
   * 
   * The function make a HTTP POST request to the backend to get the corresponded action owner
   */
  getActionOwner(condition : any) {
    this.http.post(this.baseUrl + 'getactionowner', condition).subscribe(
      res => {
        if (res !== []) {
          //console.log(res); // use for debugging
          this.actionOwnerData.next(res);
        }
      },
      error => {
        this.actionOwnerData.next(null);
        this.alertify.error(JSON.stringify(error.error));
      }
    );
  }
}
