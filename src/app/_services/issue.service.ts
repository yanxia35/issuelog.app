import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  baseUrl = environment.apiUrl + 'issues/';
  private issueListData = new BehaviorSubject<any>([]);
  issueList = this.issueListData.asObservable();
  private issueSummaryData = new BehaviorSubject<any>([]);
  issueSummary = this.issueSummaryData.asObservable();
  private searchStatus = new BehaviorSubject<boolean>(false);
  searchStatusOb = this.searchStatus.asObservable();
  private issueData = new BehaviorSubject<any>({
    issueEditor: 0
  });
  issue = this.issueData.asObservable();
  private editorSelectorData = new BehaviorSubject<any>({});
  editorSelector = this.editorSelectorData.asObservable();

  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  // obselete function get all issues
  // getIssues() {
  //   this.http.get(this.baseUrl).subscribe((res: any) => {
  //     this.issueListData.next(res);
  //   });
  // }

  // add new issue
  addIssue(newIssue: any) {
    return this.http.post(this.baseUrl + 'addissue', newIssue);
  }

  // getIssue(issueNo: any) {
  //   return this.http.get(this.baseUrl + issueNo);
  // }

  // save issue
  saveIssue(issue: any) {
    return this.http.post(this.baseUrl + 'issueeditsave', issue).subscribe(
      res => {
        this.issueData.next(res);
        this.updateIssueInList(res);
        this.alertify.success('Issue Saved');
      },
      error => {
        this.alertify.error(error.error);
      });
  }
  updateIssue(issue: any) {
    this.issueData.next(issue);
    this.updateIssueInList(issue);
  }
  updateIssueInList(issue: any) {
    const newIssueList = this.issueListData.value;

    const index = newIssueList.findIndex(x => x.id === issue.id);

    if (index > -1) {
      issue.ecParts = newIssueList[index].ecParts;
      newIssueList.splice(index, 1, issue);
    }
    this.issueListData.next(newIssueList);
  }
  updateActionInList(action: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(x => x.id === action.issueId);
    if (index > -1) {
      const actionIndex = newIssueList[index].issueActions.findIndex(
        x => x.id === action.id
      );
      if (actionIndex > -1) {
        newIssueList[index].issueActions.splice(actionIndex, 1, action);
      }
    }
    this.issueListData.next(newIssueList);
  }
  addNewIssueIntoList(issue: any) {
    const newIssueList = this.issueListData.value;
    newIssueList.unshift(issue);
    this.issueListData.next(newIssueList);
  }
  addActionToList(action: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(x => x.id === action.issueId);
    if (index > -1) {
      newIssueList[index].issueActions.unshift(action);
    }
    this.issueListData.next(newIssueList);
  }
  removeActionInList(action: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(x => x.id === action.issueId);
    if (index > -1) {
      const actionIndex = newIssueList[index].issueActions.findIndex(x => x.id === action.id);
      if (actionIndex > -1) {
        newIssueList[index].issueActions.splice(actionIndex, 1);
      }

    }
  }
  loadNewIssue() {
    this.editorSelectorData.next({
      issueEditor: 0
    });
  }
  loadAdvanceSearch() {
    this.editorSelectorData.next({
      issueEditor: 3
    });
  }
  searchIssues(searchValue: any) {
    this.searchStatus.next(true);
    this.issueListData.next([]);
    this.http.post(this.baseUrl + 'search', searchValue).subscribe(
      (res: any) => {
        if (res === []) {
          this.alertify.warning('Failure to find matching issues');
        }
        this.issueListData.next(res);
        this.searchStatus.next(false);
        this.alertify.success('Search Completed');
        this.getIssueSummary(res);      // calculate the number of issue under differnt categroy and pass to components
      },
      err => {
        this.alertify.error('Failure to get issue list');
      }
    );
  }
  selectIssue(issueId: any) {
    // console.log(issueId);
    this.http.get(this.baseUrl + 'getissuebyid/' + issueId).subscribe(res => {
      // console.log(res);
      if (res !== []) {
        this.issueData.next(res);
        this.alertify.success('Issue Switched');
      }
    });
  }
  toggleEditor(editor: string) {
    if (editor === 'issue') {
      this.editorSelectorData.next({
        issueEditor: 1
      });
    } else if (editor === 'action') {
      this.editorSelectorData.next({
        issueEditor: 2
      });
    } else if (editor === 'search') {
      this.editorSelectorData.next({
        issueEditor: 3
      });
    } else if (editor === 'clear') {
      this.editorSelectorData.next({
        issueEditor: 9
      });
    } else {
      this.editorSelectorData.next({
        issueEditor: 0
      });
    }
    // console.log(this.editorSelectsrData);
  }
  addFlagPartToIssue(partIssue: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(
      (x: any) => x.id === partIssue.issueId
    );
    if (index > -1) {
      const flagIndex = newIssueList[index].partIssues.findIndex(
        (x: any) => x.id === partIssue.id
      );
      if (flagIndex === -1) {
        newIssueList[index].partIssues.push(partIssue);
      }
      this.issueListData.next(newIssueList);
    }
  }

  RemoveFlagPartFromIssue(partIssue: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(
      (x: any) => x.id === partIssue.issueId
    );
    if (index > -1) {
      const partIndex = newIssueList[index].partIssues.findIndex(
        (x: any) => x.id === partIssue.id
      );
      if (partIndex > -1) {
        newIssueList[index].partIssues.splice(partIndex, 1);
      }
      this.issueListData.next(newIssueList);
    }
  }

  updateFlagPart(partIssue: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(
      (x: any) => x.id === partIssue.issueId
    );
    if (index > -1) {
      const partIndex = newIssueList[index].partIssues.findIndex(
        (x: any) => x.id === partIssue.id
      );
      if (partIndex > -1) {
        newIssueList[index].partIssues.splice(partIndex, 1, partIssue);
      }
      this.issueListData.next(newIssueList);
    }
  }

  addSubscriber(subscriber: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(x => x.id === subscriber.issueId);
    if (index > -1) {
      newIssueList[index].subscribers.unshift(subscriber);
    }
    this.issueListData.next(newIssueList);
  }
  deleteSubscriber(subscriber: any) {
    const newIssueList = this.issueListData.value;
    const index = newIssueList.findIndex(
      (x: any) => x.id === subscriber.issueId
    );

    if (index > -1) {
      const subIndex = newIssueList[index].subscribers.findIndex(
        (x: any) =>
          x.employeeId === subscriber.employeeId &&
          x.issueId === subscriber.issueId
      );
      if (subIndex > -1) {
        newIssueList[index].subscribers.splice(subIndex, 1);
      }
      this.issueListData.next(newIssueList);
    }
  }
  linkSubProjects(issueId : any){
    const issue ={
      id: issueId
    };
    const url = this.baseUrl + 'linksubprojects'
    this.http.post(url,issue).subscribe(res=>{
      this.updateIssueInList(res);
      console.log(res);
    },error=>{
      console.log(error);
      this.alertify.error(error.error);
    })
  }

  linkCustomProject(custom: {issueId : any, projectNo: string}){
    const url = this.baseUrl + 'linkcustomproject'
    this.http.post(url,custom).subscribe(res=>{
      this.updateIssueInList(res);
      console.log(res);
    },error=>{
      console.log(error);
      this.alertify.error(error.error);
    })
  }

  deleteSubProject(custom: {issueId:any,projectNo:string}){
    const url = this.baseUrl + 'deletesubproject'
    this.http.post(url,custom).subscribe(res=>{
      this.updateIssueInList(res);
      console.log(res);
    },error=>{
      console.log(error);
      this.alertify.error(error.error);
    })
  }
  updateSubProjectStatus(sub:any){
    const url = this.baseUrl + 'updatesubprojectstatus';
    this.http.post(url, sub).subscribe(res=>{
      // this.updateSubProjectStatusInIssueList(res);

    },error=>{
      console.log(error.error)
      this.alertify.error(error.error);
    },()=>{
      this.alertify.success('Status Updated');
    })
  }

  /**
   * Function takes search result which get back from backend, 
   * and calculate the number of issues based on issueStatus
   * total -- active -- EC -- closed
   * @param res: searching result 
   * 
   * Function update the Observable: issueSummary
   */
  getIssueSummary(res:any){
    const issuesum = {
      total : 0,
      active : 0,
      closed : 0,
      ec : 0
    }

    for(let issue of res){
      if(issue.issueStatus === 'active'){issuesum.active++;}
      if(issue.issueStatus === 'ec'){issuesum.ec++;}
      if(issue.issueStatus === 'closed'){issuesum.closed++;}
    }
    issuesum.total = res.length;
    
    this.issueSummaryData.next(issuesum);
  }

  private updateSubProjectStatusInIssueList(sub:any){
    const issueList = this.issueListData.value;
    const index = issueList.findIndex(x=>x.id == sub.issueId);
    const subIndex = issueList[index].subProjectStatuses.findIndex(x =>x.id == sub.id);
    console.log(issueList[index].subProjectStatuses[subIndex].status);
    console.log(sub.status)
    issueList[index].subProjectStatuses[subIndex].status = sub.status;
    this.issueListData.next(issueList);
  }
}
