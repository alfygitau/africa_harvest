import { Ward } from './../../shared/data/ward.model';
import { SubCounty } from './../../shared/data/subCounty.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { counties } from 'src/app/shared/data/Counties';
import { County } from 'src/app/shared/data/county.model';
import { GroupsService } from 'src/app/core/services/groups.service';
import { SummaryService } from 'src/app/core/services/summary.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexYAxis,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { MembersService } from 'src/app/core/services/members.service';
import { EChartsOption } from 'echarts';
import { VlcService } from 'src/app/vlc/vlc.service';
import { FarmersService } from 'src/app/farmers/farmers.service';

export type countyOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
};
export interface optionChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}
export type trainingOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  num: number = 0;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  groups = [];
  totalGroups: number = 0;
  summary: any = {};
  ToTsNo: number = 0;
  totalMembers: number = 0;
  totalNumber!: number;
  malePercentage!: number;
  femalePercentage!: number;
  disabledPercentage!: number;
  public totalSurveyMembers: number = 0;
  public totalMaleSurveyMembers: number = 0;
  public totalFemaleSurveyMembers: number = 0;

  trainingChart!: Partial<optionChart> | any;
  monthlyChart: Partial<optionChart> | any;
  trainingChartCategories = [];
  totalTrained = [];
  genderData!: EChartsOption;
  chartOptions!: Partial<ChartOptions> | any;
  countyReport: Partial<countyOptions> | any;

  public selectedCounty: any[] = [];
  myCounties: any[] = [];
  subcountyOptions = [{ subCountyId: 1, name: 'Select a subcounty' }];
  wardOptions = [{ wardId: 1, name: 'Select a ward' }];
  myGroups: any = [{ subCountyId: 1, name: 'Select a group' }];
  selectedSubcounty: [] = [];
  selectedWard: [] = [];
  selectedGroup: [] = [];

  searchedStat: any;
  totalIncome: number = 0;
  role: any 
  userCountyId!: any
  disableCountyDropdown: boolean = false
  countyName!: any

  constructor(
    private formBuilder: FormBuilder,
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    private summaryService: SummaryService,
    private membersService: MembersService,
    private vlcService: VlcService,
    private farmersService: FarmersService
  ) {
    this.userCountyId = sessionStorage.getItem('userCountyId') || 0
    this.role = localStorage.getItem('roles')
  }

  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

  private formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  

  ngOnInit(): void {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    this.counties = counties;
    this.myCounties = this.transformCounties(counties);
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Dashboard', active: true },
    ];

    if(this.role.includes('CIO')) {
      console.log(this.selectedCounty)
      this.countyName = counties.filter((county) => county.county_id === parseInt(this.userCountyId))
      this.selectedCounty = [{ county_id: parseInt(this.userCountyId), name: this.countyName[0].name}]
      console.log(this.countyName[0].name)
      this.searchForm = this.formBuilder.group({
        countyId: [[this.selectedCounty], Validators.required],
        subCountyId: [[], Validators.required],
        wardId: [[], Validators.required],
        groupId: [[], Validators.required],
        startDate: [this.formatDate(startDate), Validators.required],
        endDate: [this.formatDate(date), Validators.required],
      });
    }

    this.searchForm = this.formBuilder.group({
      countyId: [[parseInt(this.userCountyId)], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
      startDate: [this.formatDate(startDate), Validators.required],
      endDate: [this.formatDate(date), Validators.required],
    });
    this.getSummary();
    this.getCourseSummary();
    this.memberValueChain();
    // this.getIncomeSummary(this.searchForm.value);
    // this.filterVLCSummaryByLocation(this.searchForm.value);
    // this.filterGroups(this.searchForm.value);
    // this.filterCount(this.searchForm.value);
    // this.getTrainingsByLocationAndDate();
    this.getTotalSurveyCount();

    this.searchForm.valueChanges.subscribe(() => {
      let obj = {
        countyId: this.searchForm
          .get('countyId')
          ?.value.map((county: any) => county.county_id),
        subCountyId: this.searchForm
          .get('subCountyId')
          ?.value.map((subCounty: any) => subCounty.subCountyId),
        wardId: this.searchForm
          .get('wardId')
          ?.value.map((ward: any) => ward.wardId),
        groupId: this.searchForm
          .get('groupId')
          ?.value.map((group: any) => group.group_id),
        startDate: this.searchForm.get('startDate')?.value
          ? this.searchForm.get('startDate')?.value
          : '',
        endDate: this.searchForm.get('endDate')?.value
          ? this.searchForm.get('endDate')?.value
          : '',
      };
      console.log(obj)
      this.filterCount(obj);
      this.fetchSurveyCount(obj);
      this.filterGroups(obj);
    });

    this.trainingChart = {
      series: [
        {
          name: 'Trained',
          data: [],
        },
      ],
      chart: {
        height: 360,
        type: 'bar',
        toolbar: {
          show: true,
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          distributed: true,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },

      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [
          'Enterprise Development',
          'Group Dynamics',
          'VSLA',
          'GAPS',
        ],
      },
      fill: {
        colors: [
          '#540d6e',
          '#ee4266',
          '#ffd23f',
          '#a663cc',
          '#0ead69',
          '#8f2d56',
        ],
      },
    };

    this.monthlyChart = {
      series: [
        {
          name: 'VCL Involment',
          data: [],
        },
      ],
      chart: {
        height: 360,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          distributed: true,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },

      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [],
      },
      colors: [
        '#ef476f',
        '#ffd166',
        '#06d6a0',
        '#90be6d',
        '#118ab2',
        '#fe7f2d',
      ],
    };

    this.genderData = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },

      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
      },
      series: [
        {
          name: 'Gender Comparison',
          type: 'pie',
          roseType: 'area',
          radius: [20, 120],
          center: ['50%', '50%'],

          // roseType: 'area',
          // itemStyle: {
          //   borderRadius: 5
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: [
            {
              value: 0,
              name: 'Male',
            },

            {
              value: 0,
              name: 'Female',
            },
            {
              value: 0,
              name: 'Persons With Disability',
            },
            {
              value: 0,
              name: 'Total',
            },
          ],
        },
      ],
    };

    this.chartOptions = {
      series: [
        {
          name: 'VCL Incomes',
          data: [0, 0, 0, 0, 0],
          color: '#90e0ef',
        },
      ],

      chart: {
        height: 360,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false, // This will disable data labels for all data points
      },
      stroke: {
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '45%',
          distributed: true,
          borderRadiusApplication: 'end',
        },
      },
      xaxis: {
        categories: [],
      },
      fill: {
        colors: ['#90e0ef'],
      },
    };

    this.countyReport = {
      series: [
        {
          name: 'Income',
          type: 'area',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Farmers',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4],
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        style: {
          colors: ['#90e0ef'],
        },
      },
      labels: [
        'Machakos',
        'Meru',
        'Taita Taveta',
        'Makueni',
        'Elgeyo Marakwet',
        'Homa Bay',
        'Kitui',
        'Siaya',
        'Busia',
        'Tharaka Nithi',
      ],
      xaxis: {
        type: 'text',
      },
      yaxis: [
        {
          title: {
            text: 'Income',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Farmers',
          },
        },
      ],
      colors: ['#98c1d9', '#540d6e'],
    };
  }

  filter(value: any) {
    const selectedCountyIds = value?.map((county: any) => county.county_id);
    if (selectedCountyIds) {
      const filteredSubcounties = this.counties
        .filter((county) => selectedCountyIds.includes(county.county_id))
        .flatMap((county) => county.sub_counties);
      this.subcountyOptions = [
        { subCountyId: 1, name: 'Select a subcounty' },
        ...filteredSubcounties,
      ];
      this.wardOptions = [{ wardId: 1, name: 'Select a ward' }];
    }
  }

  filterWards(selectedSubcounties: any[]) {
    this.wardOptions = [{ wardId: 1, name: 'Select a ward' }];
    selectedSubcounties.forEach((subcounty) => {
      if (subcounty && subcounty.wards) {
        this.wardOptions.push(...subcounty.wards);
      }
    });
  }

  transformCounties(data: any) {
    return data.map((county: any) => ({
      label: county.name,
      value: county.county_id,
    }));
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

  fetchGroups() {}

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

  search() {
    console.log(this.searchForm.value);
    this.getIncomeSummary(this.searchForm.value);
    this.filterVLCSummaryByLocation(this.searchForm.value);
    this.filterGroups(this.searchForm.value);
    this.filterCount(this.searchForm.value);
    this.getCourseSummary();
  }

  getIncomeSummary(data: any) {
    this.membersService
      .getTotalMembersCountiesIncomeSummary(data)
      .subscribe((res) => {
        console.log(res);
        if (res.statusCode == 200) {
          this.searchedStat = res.message.message;
          this.totalMembers = res.message.message.members[0];
          this.totalIncome = this.searchedStat.incomes[0];
          this.cdr.markForCheck();
        }
      });
  }

  filterVLCSummaryByLocation(data: any) {
    this.vlcService.getValueChainSummaryByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        const categories = res.message.map((row: any) => row.value_chain_name);
        const values = res.message.map((row: any) => row.member_count);

        this.monthlyChart = {
          ...this.monthlyChart,
          series: [{ data: values }],
          xaxis: { categories: categories },
        };
        this.cdr.markForCheck();
      }
    });
  }

  filterGroups(data: any) {
    if (this.searchForm) {
      this.groupsService.getGroupsByLocation(data).subscribe((res) => {
        if (res.statusCode == 200) {
          this.groups = res.message;
          // this.totalGroups = this.groups.length;
          this.cdr.markForCheck();
          this.myGroups = [
            { group_id: 1, name: 'Select a group' },
            ...res.message.map((group: any) => ({
              group_id: group.group_id,
              name: group.group_name,
              ward_id: group.ward_id,
              description: group.description,
              group_admin_name: group.group_admin.name,
            })),
          ];
        }
      });
      this.getTrainingsByLocationAndDate();
    }
  }

  filterCount(data: any) {
    this.membersService.getCountsByLocations(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.totalGroups = res.message.total_groups;
        this.ToTsNo = res.message.total_tots;
        let males = res.message.total_male_members;
        let females = res.message.total_female_members;
        this.totalNumber = males + females;
        this.totalMembers = res?.message?.total_members;
        let pwd =
          res.message.total_disabled_male_tots +
          res.message.total_disabled_female_tots;
        this.malePercentage = (males / this.totalNumber) * 100;
        this.femalePercentage = (females / this.totalNumber) * 100;
        this.disabledPercentage = (pwd / this.totalNumber) * 100;

        this.setGenderChart();
        this.cdr.markForCheck();
      }
    });
  }

  getSummary() {
    this.summaryService.getSummary().subscribe((res) => {
      if (res.statusCode == 200) {
        this.summary = res.message;
        this.totalGroups = res.message.total_groups;
        this.ToTsNo = this.summary.total_tots;
        this.totalMembers = this.summary.total_members;
        this.totalNumber = this.summary.total_members;
        this.malePercentage =
          this.summary.total_male_members +
          this.summary.total_disabled_male_tots;
        this.femalePercentage =
          this.summary.total_female_members +
          this.summary.total_disabled_female_tots;
        this.disabledPercentage =
          this.summary.total_disabled_male_tots +
          this.summary.total_disabled_female_tots;

        this.setGenderChart();
        this.cdr.markForCheck();
      }
    });
  }

  memberValueChain() {
    this.membersService.getMemberValueChain().subscribe((res) => {
      if (res.statusCode == 200) {
        this.updateChartOptionsData(res.message);
        this.cdr.markForCheck();
      }
    });
  }

  getCourseSummary() {
    this.membersService.getCoursesTrainedMembers().subscribe((res) => {
      if (res.statusCode == 200) {
        this.updateTrainedChart(res.message);
        this.cdr.markForCheck();
      }
    });
  }

  getTrainingsByLocationAndDate() {
    let obj = {
      countyId: this.searchForm
        .get('countyId')
        ?.value.map((county: any) => county.county_id),
      subCountyId: this.searchForm
        .get('subCountyId')
        ?.value.map((subCounty: any) => subCounty.subCountyId),
      wardId: this.searchForm
        .get('wardId')
        ?.value.map((ward: any) => ward.wardId),
      groupId: this.searchForm.get('groupId')?.value,
      startDate: this.searchForm.get('startDate')?.value
        ? this.searchForm.get('startDate')?.value
        : '',
      endDate: this.searchForm.get('endDate')?.value
        ? this.searchForm.get('endDate')?.value
        : '',
    };
    this.farmersService
      .getTotalMembersTrainedByLocation(obj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.updateTrainedChart(res.message);
          this.cdr.markForCheck();
        }
      });
  }

  updateChartOptionsData(data: any) {
    const categories = data.map((row: any) => row.valueChainName);
    const values = data.map((row: any) => row.memberCount);

    this.monthlyChart = {
      ...this.monthlyChart,
      series: [{ data: values }],
      xaxis: { categories: categories },
    };
    this.cdr.markForCheck();
  }

  updateTrainedChart(data: any) {
    this.trainingChartCategories = data.map((row: any) => row.title);
    this.totalTrained = data.map((row: any) => row.total_members_trained);

    if (this.trainingChart.xaxis && this.trainingChart.series) {
      this.trainingChart.xaxis.categories = this.trainingChartCategories;

      this.trainingChart.series[0].data = this.totalTrained;

      this.trainingChart = {
        ...this.trainingChart,
        xaxis: { categories: this.trainingChartCategories },
        series: [{ data: this.totalTrained }],
      };
      this.cdr.markForCheck();
    }
  }

  setGenderChart() {
    this.genderData = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },

      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
      },
      series: [
        {
          name: 'Gender Comparison',
          type: 'pie',
          roseType: 'area',
          radius: [20, 120],
          center: ['50%', '50%'],

          // roseType: 'area',
          // itemStyle: {
          //   borderRadius: 5
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: [
            {
              value:
                ((this.summary.total_male_members +
                  this.summary.total_disabled_male_tots) /
                  this.totalNumber) *
                100,
              name: 'Male',
            },
            {
              value:
                ((this.summary.total_female_members +
                  this.summary.total_disabled_female_tots) /
                  this.totalNumber) *
                100,
              name: 'Female',
            },
            {
              value:
                ((this.summary.total_disabled_male_tots +
                  this.summary.total_disabled_female_tots) /
                  this.totalNumber) *
                100,
              name: 'Living with disability',
            },
          ],
        },
      ],
    };
  }

  getTotalSurveyCount() {
    this.summaryService.getTotalSurveyCount().subscribe((res) => {
      this.totalSurveyMembers = res.message.total_survey_count;
      this.totalFemaleSurveyMembers = res.message.female_surveyed_count;
      this.totalMaleSurveyMembers = res.message.male_surveyed_count;
    });
  }

  fetchSurveyCount(obj: any) {
    this.summaryService.getSurveyCount(obj).subscribe((res) => {
      this.totalSurveyMembers = res.message[0].survey_count;
      this.totalFemaleSurveyMembers = res.message[0].female_surveyed_count;
      this.totalMaleSurveyMembers = res.message[0].male_surveyed_count;
    });
  }
}
