import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '../core/services/auth.service';
import { Observable, map } from 'rxjs';

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

  getGroupMembers(id: any): Observable<any> {
    return this.http
      .get(endpoint + 'members/' + id + '?page=1&size=10')
      .pipe(map(this.extractData));
  }

  getGroupsByLocation(data: any): Observable<any> {
    return this.http
      .post(endpoint + 'groups/by-locations', data)
      .pipe(map(this.extractData));
  }

  getGroupDetails(id: any): Observable<any> {
    return this.http
      .get(endpoint + 'groups/get/' + id)
      .pipe(map(this.extractData));
  }
}
