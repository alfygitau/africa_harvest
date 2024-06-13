import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { endpoint } from './auth.service';

@Injectable({
    providedIn:'root'
})

export class MembersService {
    constructor(private http:HttpClient) {}

    private extractData(res: any){
        const body = res 
        return body || {}
    }

    getCoursesTrainedMembers(): Observable<any> {
        return this.http.get(endpoint+'training/get-courses-and-members-trained').pipe(
          map((this.extractData))
        )
    }
    getMemberValueChain(){
        return this.http.get(endpoint + 'member-value-chain/get/count-details').pipe(
          map((this.extractData))
        )
    }

    getTotalMembersCountiesIncomeSummary(data: any): Observable<any> {
        return this.http.post(endpoint+'reports/members-titles-income-summary', data).pipe(
          map((this.extractData))
        )
    }


    getCountsByLocations(data: any): Observable<any> {
        return this.http.post(endpoint+'reports/counts-by-locations-and-date-range', data).pipe(
          map((this.extractData))
        )
    }

    getTrainingByLocationAndDate(data: any): Observable<any> {
      return this.http.post(endpoint+'training/trains', data).pipe(
        map((this.extractData))
      )
    }
}