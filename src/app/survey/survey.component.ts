import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountUpModule } from 'ngx-countup';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { counties } from '../shared/data/Counties';
import { County } from '../shared/data/county.model';
import { SubCounty } from '../shared/data/subCounty.model';
import { Ward } from '../shared/data/ward.model';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupsService } from '../core/services/groups.service';
import { SummaryService } from '../core/services/summary.service';

@Component({
  selector: 'app-survey',
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
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss',
})
export class SurveyComponent implements OnInit {
  @ViewChild('chart')
  barchart!: ChartComponent;
  public barChartOptions: any;

  @ViewChild('chart')
  piechart!: ChartComponent;
  public pieChartOptions: any;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  groups = [];
  totalGroups: number = 0;
  rows: any = [];

  dataParams: any = {
    page_num: 1,
    page_size: 10,
  };

  public breadCrumbItems!: Array<{}>;
  public totalProjectedSurveyMembers: number = 0;
  public totalSurveyMembers: number = 0;
  public totalMaleSurveyMembers: number = 0;
  public totalFemaleSurveyMembers: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private groupsService: GroupsService,
    private summaryService: SummaryService
  ) {
    this.barChartOptions = {
      series: [
        {
          name: 'Male',
          data: [8, 12, 13, 14, 7, 11, 2, 16, 16, 4],
        },
        {
          name: 'Female',
          data: [11, 6, 14, 9, 7, 15, 11, 14, 4, 1],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Taita Taveta',
          'Meru',
          'Tharaka Nithi',
          'Kitui',
          'Machakos',
          'Makueni',
          'Elgeyo Marakwet',
          'Busia',
          'Homabay',
          'Siaya',
        ],
      },
      yaxis: {
        title: {
          text: '(Participants)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + ' Participants';
          },
        },
      },
      legend: {
        show: true,
      },
      colors: ['#f4b044', '#238468'],
    };
    this.pieChartOptions = {
      series: [670, 330],
      chart: {
        width: '100%',
        type: 'pie',
      },
      labels: ['Male', 'Female'],
      theme: {
        monochrome: {
          enabled: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      colors: ['#f4b044', '#238468'],
    };
  }

  ngOnInit() {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.counties = counties;

    this.searchForm = this.formBuilder.group({
      countyId: [[12], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
      startDate: [this.formatDate(startDate), Validators.required],
      endDate: [this.formatDate(date), Validators.required],
    });

    this.breadCrumbItems = [
      { label: 'Survey' },
      { label: 'Results', active: true },
    ];

    this.searchForm.valueChanges.subscribe(() => {
      this.fetchSurveyCount();
    });

    this.dataParams = {
      page_num: 1,
      page_size: 10,
    };

    this.fetchSurveyCount();
    this.getSurveyList();
  }

  fetchSurveyCount() {
    let obj = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
    };
    this.summaryService.getSurveyCount(obj).subscribe((res) => {
      this.totalSurveyMembers = res.message.reduce(
        (total: any, item: any) => total + item.survey_count,
        0
      );
      this.totalFemaleSurveyMembers = res.message.reduce(
        (total: any, item: any) => total + item.female_surveyed_count,
        0
      );
      this.totalMaleSurveyMembers = res.message.reduce(
        (total: any, item: any) => total + item.male_surveyed_count,
        0
      );
      this.pieChartOptions.series = [
        this.totalMaleSurveyMembers,
        this.totalFemaleSurveyMembers,
      ];
    });
  }

  private formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  subCounties(event: Event) {
    if (this.searchForm) {
      let ids = this.searchForm.get('countyId')?.value;
      let filtered_array = this.counties.filter((obj: any) =>
        ids.includes(obj.county_id)
      );
      filtered_array.forEach((element) => {
        this.sub_counties = this.sub_counties.concat(element.sub_counties);
      });
    }
  }

  getWards(event: Event) {
    if (this.searchForm) {
      let ids = this.searchForm.get('subCountyId')?.value;
      let filtered_array = this.sub_counties.filter((obj: any) =>
        ids.includes(obj.subCountyId)
      );
      filtered_array.forEach((element) => {
        this.wards = this.wards.concat(element.wards);
      });
    }
  }

  getSurveyList() {
    let obj = this.dataParams;
    this.summaryService.getSurveyList(obj).subscribe((res) => {
      console.log(res);
      this.rows = res.message;
    });
  }

  filterGroups(data: any) {
    if (this.searchForm) {
      let obj = {
        countyId: this.searchForm.get('countyId')?.value,
        subCountyId: this.searchForm.get('subCountyId')?.value,
        wardId: this.searchForm.get('wardId')?.value,
        startDate: this.searchForm.get('startDate')?.value
          ? this.searchForm.get('startDate')?.value
          : '',
        endDate: this.searchForm.get('endDate')?.value
          ? this.searchForm.get('endDate')?.value
          : '',
      };
      this.groupsService.getGroupsByLocation(obj).subscribe((res) => {
        if (res.statusCode == 200) {
          this.groups = res.message;
          this.totalGroups = this.groups.length;
        }
      });
    }
  }

  setPage(pageInfo: any) {
    // console.log(pageInfo)
    this.dataParams.page_num = pageInfo;
    // this.dataParams.page_num = pageInfo.offset;
    let data = {
      page: this.dataParams.page_num,
      dataObj: this.searchForm.value,
      size: this.dataParams.page_size,
    };
  }
}
