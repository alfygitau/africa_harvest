import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
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

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   yaxis: ApexYAxis;
//   xaxis: ApexXAxis;
//   fill: ApexFill;
//   tooltip: ApexTooltip;
//   stroke: ApexStroke;
//   legend: ApexLegend;
// };

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CountUpModule,
    NgApexchartsModule,
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

  public breadCrumbItems!: Array<{}>;
  public totalProjectedSurveyMembers: number = 2000;
  public totalSurveyMembers: number = 1000;
  public totalMaleSurveyMembers: number = 670;
  public totalFemaleSurveyMembers: number = 330;
  constructor() {
    this.barChartOptions = {
      series: [
        {
          name: 'Male',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 30, 20],
        },
        {
          name: 'Female',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 30, 15],
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
          'Kakamega',
          'Busia',
          'Homabay',
          'Siya',
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

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Survey' },
      { label: 'Results', active: true },
    ];
  }
}
