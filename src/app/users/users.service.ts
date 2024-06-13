import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserInfo } from '../core/models/auth.models';
import { endpoint } from '../core/services/auth.service';
import { County, NewCounty, SuperSubCounty } from '../shared/data/county.model';
import { counties } from '../shared/data/Counties';
import { Ward } from '../shared/data/ward.model';
import { SubCounty } from '../shared/data/subCounty.model';
import { NewUser } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public users = [];
  private counties: County[] = counties;

  constructor(private http: HttpClient) {}

  getUsers(page: number, size: number): Observable<UserInfo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<{ message: UserInfo[] }>(endpoint + 'users/all', { params })
      .pipe(map((response) => response.message));
  }

  getUserProfile(id: string) {
    return this.http
      .get<{ message: UserInfo }>(`${endpoint}users/fetch?msisdn=${id}`)
      .pipe(map((response) => response?.message));
  }

  fetchCounties(): County[] {
    return this.counties;
  }
  fetchSubCounties(countyId: number): SubCounty[] {
    const county = this.counties.find((c) => c.county_id === countyId);
    return county ? county.sub_counties : [];
  }

  getWards(subCountyId: number): Ward[] {
    const county = this.counties.find((c) =>
      c.sub_counties.some((sc) => sc.subCountyId === subCountyId)
    );
    const subCounty = county
      ? county.sub_counties.find((sc) => sc.subCountyId === subCountyId)
      : undefined;
    return subCounty ? subCounty.wards : [];
  }

  createUser(userPayload: NewUser) {
    return this.http.post(endpoint + 'users/create', userPayload);
  }

  getWardById(id: number) {
    return this.http
      .get<{ message: Ward }>(`${endpoint}wards/get/id/${id}`)
      .pipe(map((response) => response?.message));
  }

  updateUser(username: string, payload: Partial<NewUser>) {
    return this.http.put(endpoint + 'users/update/' + username, payload);
  }

  updateMember(memberId: number, payload: Partial<NewUser>) {
    return this.http.put(endpoint + 'member/update/' + memberId, payload);
  }
}
