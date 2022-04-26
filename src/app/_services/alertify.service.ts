import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}
/**
 *
 * @param {string} message confirmation message for pop up dialog
 * @param okCallback Call back function that if user click "Yes" button
 * @param cancelCallBack optional call back function if user click "No" button
 */
  confirm(message: string, okCallback: () => any, cancelCallBack?: ()=> any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {
      }
    }, (e:any) =>{
      if(e){
        cancelCallBack();
      }
    });
  }
  /**
   *
   * @param {string} message some message for success pop up dialog
   */
  success(message: string) {
    alertify.success(message);
  }
/**
 *
 * @param {string} message error message for pop up dialog
 */
  error(message: string) {
    alertify.error(message);
  }

  /**
   *
   * @param {string} message warning message for pop up dialog
   */
  warning(message: string) {
    alertify.warning(message);
  }


  message(message: string) {
    alertify.message(message);
  }
}
