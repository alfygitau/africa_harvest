import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { endpoint } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient) {}

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  addGroup(data: any): Observable<any> {
    return this.http
      .post(endpoint + 'groups/create', data)
      .pipe(map(this.extractData));
  }

  getGroups(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http
      .get(endpoint + 'groups/all', { params })
      .pipe(map(this.extractData));
  }

  getDynamicGroups(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'groups/all?page=' + data + '&size=15')
      .pipe(map(this.extractData));
  }

  getGroupDetails(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'groups/get/' + data)
      .pipe(map(this.extractData));
  }

  getGroupsByLocation(data: any): Observable<any> {
    return this.http
      .post(endpoint + 'groups/by-locations', data)
      .pipe(map(this.extractData));
  }

  deleteGroup(data: any): Observable<any> {
    return this.http
      .delete(endpoint + 'groups/delete/' + data)
      .pipe(map(this.extractData));
  }

  getGroupMembers(data: any): Observable<any> {
    return this.http
      .get(endpoint + 'members/' + data + '?page=1&size=15')
      .pipe(map(this.extractData));
  }

  getSeedDistributionReport() {
    return this.http
      .get(endpoint + 'seed-distribution')
      .pipe(map(this.extractData));
  }
}
