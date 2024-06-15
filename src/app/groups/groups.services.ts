import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '../core/services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn:'root'
})


export class GroupsService {
    constructor(private http:HttpClient){}

    private extractData(res: any){
        const body = res 
        return body || {}
    }

    addGroup(data: any): Observable<any>{
        return this.http.post(endpoint+ 'groups/create', data).pipe(
          map((this.extractData))
        )
    }

    getGroupMembers(data: any):Observable<any> {
        return this.http.get(endpoint+'members/'+ data +'?page=1&size=15').pipe(
          map((this.extractData))
        )
    }

    getGroupsByLocation(data: any):Observable<any> {
        return this.http.post(endpoint + 'groups/by-locations', data).pipe(
          map((this.extractData))
        )
    }

    getGroupDetails(data: any): Observable<any> {
      return this.http.get(endpoint+'groups/get/'+data).pipe(
        map((this.extractData))
      )
    }


}