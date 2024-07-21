import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SummaryService } from '../core/services/summary.service';

// PrimeNG Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { counties } from '../shared/data/Counties';
import { County } from '../shared/data/county.model';
import { GroupsService } from '../groups/groups.services';

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
    MultiSelectModule,
    CardModule,
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent implements OnInit {
  searchForm!: FormGroup;
  rows: any = [];
  counties: County[] = [];
  dataParams: any = {
    page_num: 1,
    page_size: 10,
  };
  public totalCounts: number = 1;
  public breadCrumbItems!: Array<{}>;
  groups: any = [];

  public selectedCounty: any[] = [];
  myCounties: any[] = [];
  subcountyOptions = [{ subCountyId: 1, name: 'Select a subcounty' }];
  wardOptions = [{ wardId: 1, name: 'Select a ward' }];
  myGroups: any = [{ subCountyId: 1, name: 'Select a group' }];
  selectedSubcounty: [] = [];
  selectedWard: [] = [];
  selectedGroup: [] = [];

  constructor(
    private summaryService: SummaryService,
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);

    this.searchForm = this.formBuilder.group({
      start_date: [this.formatDate(startDate), Validators.required],
      end_date: [this.formatDate(date), Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
    });
    this.breadCrumbItems = [
      { label: 'Survey' },
      { label: 'List', active: true },
    ];
    this.counties = counties;
    this.myCounties = this.transformCounties(counties);

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
        startDate: this.searchForm.get('start_date')?.value
          ? this.searchForm.get('start_date')?.value
          : '',
        endDate: this.searchForm.get('end_date')?.value
          ? this.searchForm.get('end_date')?.value
          : '',
      };
      let data = {
        page: this.dataParams.page_num,
        dataObj: obj,
        size: this.dataParams.page_size,
      };
      this.filterGroups(obj);
    });
    this.getSurveyList();
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

  filterGroups(data: any) {
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.groups = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  filter(value: any) {
    const selectedCountyIds = value?.map((county: any) => county.county_id);
    if (selectedCountyIds) {
      const filteredSubcounties = this.counties
        .filter((county: any) => selectedCountyIds.includes(county.county_id))
        .flatMap((county: any) => county.sub_counties);

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

  getSurveyList() {
    let obj = this.dataParams;
    this.summaryService.getSurveyList(obj).subscribe((res) => {
      this.rows = res.message.surveys;
      this.totalCounts = res.message.total_count;
    });
  }

  setPage(pageInfo: any) {
    this.dataParams.page_num = pageInfo;
    this.summaryService.getSurveyList(this.dataParams).subscribe((res) => {
      this.rows = res.message.surveys;
      this.totalCounts = res.message.total_count;
    });
  }

  exportList() {
    let data = {
      page: 1,
      size: 250,
    };
    this.groupsService.exportSurveyList().subscribe((res) => {
      
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(res);
      a.href = objectUrl;
      a.download = 'survey-list.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.cdr.markForCheck();
    });
  }
}
