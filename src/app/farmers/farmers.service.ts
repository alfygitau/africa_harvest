import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '../core/services/auth.service';
import { Observable, map } from 'rxjs';
import { end } from '@popperjs/core';

@Injectable({
  providedIn: 'root',
})
export class FarmersService {
  constructor(private http: HttpClient) {}

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  addFarmer(data: any): Observable<any> {
    return this.http
      .post(endpoint + 'member/create', data)
      .pipe(map(this.extractData));
  }
  getGroupMembers(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'members/' + data + '?page=1&size=15')
      .pipe(map(this.extractData));
  }
  getWardToTs(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'users/tot/2/' + data)
      .pipe(map(this.extractData));
  }

  getMembersByLocations(data: any): Observable<any> {
    return this.http
      .post(endpoint + '/members/by-location?page=1&size=20', data)
      .pipe(map(this.extractData));
  }

  getClients(data: any): Observable<any> {
    return this.http
      .post(
        endpoint + 'members?page=' + data.page + '&size=' + data?.size,
        data.dataObj
      )
      .pipe(map(this.extractData));
  }
  getTotalMembersTrainedByLocation(data: any): Observable<any> {
    return this.http
      .post(
        endpoint + 'training/get-courses-and-members-trained-by-location',
        data
      )
      .pipe(map(this.extractData));
  }

  exportMembers(data: any) {
    return this.http
      .post(endpoint + 'selected-members/xlsx', data, {
        responseType: 'blob',
      })
      .pipe(map(this.extractData));
  }
  exportAllMembers(data: any) {
    return this.http
      .post(
        endpoint + 'members/xlsx?page=' + data.page + '&size=' + data?.size,
        data.dataObj,
        { responseType: 'blob' }
      )
      .pipe(map(this.extractData));
  }
}
