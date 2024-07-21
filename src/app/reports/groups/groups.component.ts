import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { SharedModule } from '../../shared/shared.module';
import { County } from '../../shared/data/county.model';
import { Ward } from '../../shared/data/ward.model';
import { counties } from 'src/app/shared/data/Counties';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupsService } from 'src/app/core/services/groups.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    NgbPagination,
    CommonModule,
    MultiSelectModule,
    CardModule,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  searchForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  groups: any = [];
  ColumnMode = ColumnMode;
  public columns = [];
  dataParams: any = {
    page_num: '',
    page_size: '',
  };
  public size: number = 1;
  public limit: number = 10;
  public totalGroups: number = 0;

  public selectedCounty: any[] = [];
  myCounties: any[] = [];
  subcountyOptions = [{ subCountyId: 1, name: 'Select a subcounty' }];
  wardOptions = [{ wardId: 1, name: 'Select a ward' }];
  myGroups: any = [{ subCountyId: 1, name: 'Select a group' }];
  selectedSubcounty: [] = [];
  selectedWard: [] = [];
  selectedGroup: [] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private groupsService: GroupsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const date = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    this.dataParams.page_num = 1;
    this.dataParams.page_size = 10;

    this.counties = counties;
    this.myCounties = this.transformCounties(counties);
    
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: 'Groups', active: true },
    ];

    this.searchForm = this.formBuilder.group({
      start_date: [this.formatDate(startDate), Validators.required],
      end_date: [this.formatDate(date), Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
    });

    this.getGroups();

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
      this.filterGroups(data);
    });
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

  edit(row: any) {
    console.log(row);
  }

  onPageChange(page: number) {
    this.size = page;
    this.getGroups();
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

  viewGroupDetails(row: any) {
    console.log(row);
    sessionStorage.setItem('selected', JSON.stringify(row));
    this.router.navigate(['/groups/group/', row.group_id]);
  }

  getGroups() {
    this.groupsService.getGroups(this.size, this.limit).subscribe((res) => {
      if (res.statusCode == 200) {
        this.totalGroups = 200;
        this.groups = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit() {}

  filtergroups(data: any) {
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        console.log(res);
        this.groups = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  filterGroups(data: any) {
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.groups = res.message;
        this.cdr.markForCheck();
      }
    });
  }

  search() {
    let obj = {
      countyId: this.searchForm.get('countyId')?.value,
      subCountyId: this.searchForm.get('subCountyId')?.value,
      wardId: this.searchForm.get('wardId')?.value,
      startDate: '',
      endDate: '',
    };
    this.filterGroups(obj);
  }

  subCounties() {
    let ids = this.searchForm.get('countyId')?.value;
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
    this.search();
  }

  getWards() {
    let ids = this.searchForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
    this.search();
  }

  onGroupSelect() {
    this.search();
  }

  setPage(pageInfo: any) {
    this.dataParams.page_num = pageInfo;
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
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
      this.groups = res.message;
      this.cdr.markForCheck();
    });
  }

  exportAllGroups() {
    let data = {
      page: 1,
      size: 250,
    };
    this.groupsService.exportAllGroups(data).subscribe((res) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(res);
      a.href = objectUrl;
      a.download = 'groups.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.cdr.markForCheck();
    });
  }
}
