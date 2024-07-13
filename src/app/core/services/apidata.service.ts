import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApidataService {

  BaseUrl: string = 'https://api.jsonbin.io/v3/b';

  constructor(
    private _HttpClient: HttpClient
  ) { }

  getCustomers(): Observable<any> {
    return this._HttpClient.get(`${this.BaseUrl}/669079fbacd3cb34a864c4b7`,{
      headers:{
        'X-MASTER-KEY':'$2a$10$WOVDsAoQTH6P.wsx/ZPqkurYBxl2xCt3EhtVItXxfCc.i3YSvEyj.',
      }
    });
  }
}
