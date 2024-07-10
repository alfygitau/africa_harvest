import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SummaryService } from '../core/services/summary.service';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CountUpModule,
    NgApexchartsModule,
    NgbModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent implements OnInit {
  rows: any = [];

  dataParams: any = {
    page_num: 1,
    page_size: 10,
  };

  public breadCrumbItems!: Array<{}>;

  constructor(private summaryService: SummaryService) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Survey' },
      { label: 'List', active: true },
    ];

    this.getSurveyList();
  }

  getSurveyList() {
    let obj = this.dataParams;
    this.summaryService.getSurveyList(obj).subscribe((res) => {
      this.rows = res.message;
    });
  }

  setPage(pageInfo: any) {
    this.dataParams.page_num = pageInfo;
    this.summaryService.getSurveyList(this.dataParams).subscribe((res) => {
      this.rows = res.message;
    });
  }
}
