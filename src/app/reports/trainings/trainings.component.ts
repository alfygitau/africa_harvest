import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoursesService } from 'src/app/courses/courses.service';
import { GroupsService } from 'src/app/groups/groups.services';
import { counties } from 'src/app/shared/data/Counties';
import { County } from 'src/app/shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { SharedModule } from 'src/app/shared/shared.module';

import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    CommonModule,
    NgbPagination,
    MultiSelectModule,
    CardModule,
  ],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  ColumnMode = ColumnMode;
  trainings: any = [];
  dataParams: any = {
    page_num: '',
    page_size: '',
  };
  groups = [];

  public selectedCounty: any[] = [];
  myCounties: any[] = [];
  subcountyOptions = [{ subCountyId: 1, name: 'Select a subcounty' }];
  wardOptions = [{ wardId: 1, name: 'Select a ward' }];
  myGroups: any = [{ subCountyId: 1, name: 'Select a group' }];
  selectedSubcounty: [] = [];
  selectedWard: [] = [];
  selectedGroup: [] = [];

  private formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  constructor(
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private coursesSerice: CoursesService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: 'Trainings', active: true },
    ];
    this.dataParams.page_num = 1;
    this.dataParams.page_size = 10;
    this.counties = counties;
    this.myCounties = this.transformCounties(counties);
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
      // this.getTrainingWithFilters(obj);
    });

    this.getTrainings();
  }

  filter(value: any) {
    const selectedCountyIds = value?.map((county: any) => county.county_id);
    if (selectedCountyIds) {
      const filteredSubcounties = this.counties
        .filter((county) => selectedCountyIds.includes(county.county_id))
        .flatMap((county) => county.sub_counties);
      console.log(filteredSubcounties);
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

  onSubmit() {
    let data = this.searchForm.value;
    if (data.wardId.length > 0) {
      data.subCountyId = [];
      data.countyId = [];
    }
    if (data.subCountyId.length > 0) {
      data.wardId = [];
      data.countyId = [];
    }
  }

  getTrainings() {
    this.coursesSerice
      .getTrainings(this.dataParams.page_num)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.trainings = res.message.trainings;
          this.cdr.markForCheck();
        }
      });
  }

  view(row: any) {}

  getTrainingWithFilters(data: any) {
    this.coursesSerice.getTrainingReportByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.trainings = res.message.trainings;
        this.cdr.markForCheck();
      }
    });
  }

  setPage(pageInfo: any) {
    this.dataParams.page_num = pageInfo;
    let data = {
      page: this.dataParams.page_num,
      dataObj: this.searchForm.value,
    };
    this.coursesSerice
      .getTrainings(this.dataParams.page_num)
      .subscribe((res) => {
        this.trainings = res.message.trainings;
      });
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

  filterGroups(data: any) {
    if (this.searchForm) {
      this.groupsService.getGroupsByLocation(data).subscribe((res) => {
        if (res.statusCode == 200) {
          this.groups = res.message;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
