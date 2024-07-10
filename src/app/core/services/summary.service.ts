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
      .post(endpoint + 'surveys/summaries-count', payload)
      .pipe(map(this.extractData));
  }

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCountySurveyCount() {
    return this.http
      .post(endpoint + 'surveys/graph-data', {
        startDate: '2024-01-02',
        endDate: this.getFormattedDate(new Date()),
      })
      .pipe(map(this.extractData));
  }

  getTotalSurveyCount() {
    return this.http
      .get(endpoint + 'surveys/glance-count')
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
