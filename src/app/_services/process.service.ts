import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertifyService } from './alertify.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private processData = new BehaviorSubject<any[]>([]);
  processes = this.processData.asObservable();
  baseUrl = environment.apiUrl + 'process/';

  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  getProcesses() {
    if (this.processData.value.length === 0) {
      this.http.get(this.baseUrl).subscribe((res: any[]) => {
        this.processData.next(res);
      }, (error: any) => {
        this.alertify.error('Failed to load processes!');
      });
    }
  }
}
