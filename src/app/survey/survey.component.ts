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
    this.initializeChartOptions();
  }

  initializeChartOptions(): void {
    this.barChartOptions = {
      series: [
        {
          name: 'Male',
          data: [],
        },
        {
          name: 'Female',
          data: [],
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
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [], // Initially empty, will be set dynamically
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
    this.fetchCountiesSurveyCount();
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.counties = counties;

    this.searchForm = this.formBuilder.group({
      countyId: [[], Validators.required],
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

    this.getTotalSurveyCount();
    this.getSurveyList();
  }

  fetchSurveyCount() {
    let obj = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
    };
    this.summaryService.getSurveyCount(obj).subscribe((res) => {
      this.totalSurveyMembers = res.message[0].survey_count;
      this.totalFemaleSurveyMembers = res.message[0].female_surveyed_count;
      this.totalMaleSurveyMembers = res.message[0].male_surveyed_count;
      this.pieChartOptions.series = [
        this.totalMaleSurveyMembers,
        this.totalFemaleSurveyMembers,
      ];
    });
  }

  getTotalSurveyCount() {
    this.summaryService.getTotalSurveyCount().subscribe((res) => {
      this.totalSurveyMembers = res.message.total_survey_count;
      this.totalFemaleSurveyMembers = res.message.female_surveyed_count;
      this.totalMaleSurveyMembers = res.message.male_surveyed_count;
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
      this.rows = res.message;
    });
  }

  fetchCountiesSurveyCount(): void {
    this.summaryService.getCountySurveyCount().subscribe(
      (res) => {
        console.log('API Response:', res);

        const countyNames = res.message.map(
          (item: { county: string }) => item.county
        );
        const maleParticipants = res.message.map(
          (item: { male_surveyed_count: number }) => item.male_surveyed_count
        );
        const femaleParticipants = res.message.map(
          (item: { female_surveyed_count: number }) =>
            item.female_surveyed_count
        );

        console.log('County Names:', countyNames);
        console.log('Male Participants:', maleParticipants);
        console.log('Female Participants:', femaleParticipants);
        this.barChartOptions = {
          ...this.barChartOptions,
          series: [
            { ...this.barChartOptions.series[0], data: maleParticipants },
            { ...this.barChartOptions.series[1], data: femaleParticipants },
          ],
          xaxis: {
            ...this.barChartOptions.xaxis,
            categories: countyNames,
          },
        };
        this.refreshChart();
      },
      (error) => {
        console.error('Error fetching county survey count:', error);
      }
    );
  }

  refreshChart(): void {
    this.barChartOptions = { ...this.barChartOptions };
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
      this.summaryService.getTotalSurveyCount().subscribe((res) => {
        this.totalSurveyMembers = res.message.total_survey_count;
        this.totalFemaleSurveyMembers = res.message.female_surveyed_count;
        this.totalMaleSurveyMembers = res.message.male_surveyed_count;
        this.pieChartOptions.series = [
          this.totalMaleSurveyMembers,
          this.totalFemaleSurveyMembers,
        ];
      });
    }
  }
}
