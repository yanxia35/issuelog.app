import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AlertifyService } from "./alertify.service";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private projectData = new BehaviorSubject<any[]>([]);
  projects = this.projectData.asObservable();
  private subProjectData = new BehaviorSubject<any[]>([]);
  subProjects = this.subProjectData.asObservable();
  baseUrl = environment.apiUrl + "project/";

  constructor(private http: HttpClient, private alertify: AlertifyService) {}
  getProjects() {
    if (this.projectData.value.length === 0) {
      this.http.get(this.baseUrl).subscribe(
        (res: any[]) => {
          this.projectData.next(res);
        },
        (error: any) => {
          this.alertify.error("Failed to load projects!");
        }
      );
    }
  }
  getSubProjects() {
    const url = this.baseUrl + "getsubprojects";
    if (this.subProjectData.value.length === 0) {
      this.http.get(url).subscribe(
        (res: any[]) => {
          this.subProjectData.next(res);
        },
        (error: any) => {
          this.alertify.error("Failed to load sub projects!");
        }
      );
    }
  }
  updateSubProjectStatus(sub: any) {
    const url = this.baseUrl + "updateSubProjectStatus";
    this.http.post(url, sub).subscribe(
      (res: any) => {
        // console.log(res);
        this.updateSubProjectList(res);
        this.alertify.success(res.subProjectId + "'s Status Updated");
      },
      (error: any) => {
        this.alertify.error("Failed to Update Sub Project Status!");
      }
    );
  }
  private updateSubProjectList(sub: any) {
    const subProjectList = this.subProjectData.value;
    const index = subProjectList.findIndex((x) => x.id == sub.id);
    if (index != undefined) {
      subProjectList[index] = sub;
    }
    this.subProjectData.next(subProjectList);
  }
}
