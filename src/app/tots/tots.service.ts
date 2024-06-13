import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '../core/services/auth.service';
import { Observable, map } from 'rxjs';
import { end } from '@popperjs/core';
import { UserInfo } from '../core/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class TotsService {
  constructor(private http: HttpClient) {}

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  getWardToTs(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'users/tot/2/' + data)
      .pipe(map(this.extractData));
  }

  getAllToTs(page_number: any, page_size: any): Observable<any> {
    return this.http
      .get(endpoint + 'users/tots/2?page=' + page_number + '&size=' + page_size)
      .pipe(map(this.extractData));
  }

  getTotsByLocations(data: any): Observable<any> {
    return this.http
      .post(
        endpoint +
          '/members/by-location?page=' +
          data.page +
          '&size=' +
          data?.size,
        data.dataObj
      )
      .pipe(map(this.extractData));
  }

  getTot(data: any): Observable<any> {
    return this.http
      .get(end + '/users/get/' + data)
      .pipe(map(this.extractData));
  }

  getUserProfile(id: any) {
    return this.http
      .get<{ message: UserInfo }>(`${endpoint}users/get/${id}`)
      .pipe(map((response) => response?.message));
  }
  exportMembers(data: any) {
    return this.http
      .post(endpoint + 'users/select/xlsx', data, { responseType: 'blob' })
      .pipe(map(this.extractData));
  }
  exportAllMembers(data: any) {
    return this.http
      .post(endpoint + 'users/xlsx', data.dataObj, { responseType: 'blob' })
      .pipe(map(this.extractData));
  }
}
