import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '../core/services/auth.service';
import { Observable, map } from 'rxjs';


@Injectable({
    providedIn:'root'
})


export class CoursesService {
    constructor(private http:HttpClient){}

    private extractData(res: any){
        const body = res 
        return body || {}
    }

    getCoursesList():Observable<any>{
        return this.http.get(endpoint + 'course/all').pipe(
          map((this.extractData))
        )
    }

    getCourseModules(data: any): Observable<any> {
        return this.http.get(endpoint+ 'course-module/modules/'+data).pipe(
          map((this.extractData))
        )
    }

    addTraining(data: any): Observable<any> {
        return this.http.post(endpoint+'training/create', data).pipe(
          map((this.extractData))
        )
    }

    getTrainings(data: any): Observable<any> {
      return this.http.get(endpoint+"training/all?page="+data+"&size=10").pipe(
        map((this.extractData))
      )
    }
}