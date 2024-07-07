import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { endpoint } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  constructor(private http: HttpClient) {}

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  getSummary(): Observable<any> {
    return this.http.get(endpoint + 'reports/main').pipe(map(this.extractData));
  }

  getSurveyCount(payload: any) {
    return this.http
      .post(endpoint + 'surveys/summaries', payload)
      .pipe(map(this.extractData));
  }

  getTotalSurveyCount() {
    return this.http
      .post(endpoint + 'surveys/summaries', {
        countyId: [6, 12, 13, 15, 16, 17, 28, 37, 40, 41, 43],
        subCountyId: [],
        wardId: [],
      })
      .pipe(map(this.extractData));
  }

  getSurveyList(payload: any) {
    return this.http
      .get(
        endpoint +
          'surveys/?page=' +
          payload.page_num +
          '&size=' +
          payload.page_size
      )
      .pipe(map(this.extractData));
  }
}
