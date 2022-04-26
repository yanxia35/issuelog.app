import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesData = new BehaviorSubject<any[]>([]);
  employees = this.employeesData.asObservable();

  baseUrl = environment.apiUrl + 'employee/';
  constructor(private http: HttpClient, private alertify: AlertifyService) {}
  getEmployees() {
    if (this.employeesData.value.length === 0) {
      this.http.get(this.baseUrl).subscribe(
        (res: any[]) => {
          this.employeesData.next(res);
        },
        (error: any) => {
          this.alertify.error('Failed to load employees!');
        }
      );
    }
  }

  getEmployeeShortname(id: string) {
    const currentEmployees = this.employeesData.getValue();
    const index = currentEmployees.findIndex(x => x.id === id);
    if (index > -1) {
      return currentEmployees[index].shortName;
    } else {
      return null;
    }
  }
  getEmployeeFullName(id: string) {
    const currentEmployees = this.employeesData.getValue();
    const index = currentEmployees.findIndex(x => x.id === id);
    if (index > -1) {
      return currentEmployees[index].firstName + ' ' + currentEmployees[index].lastName;
    } else {
      return null;
    }
  }
}
