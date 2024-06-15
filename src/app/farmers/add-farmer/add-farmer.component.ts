import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FarmersService } from '../farmers.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { counties } from '../../shared/data/Counties';
import { County } from '../../shared/data/county.model';
import { SubCounty } from '../../shared/data/subCounty.model';
import { Ward } from '../../shared/data/ward.model';
import { SharedModule } from '../../shared/shared.module';
import { GroupsService } from '../../groups/groups.services';
import { NgSelectModule } from '@ng-select/ng-select';
import { VlcService } from '../../vlc/vlc.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-farmer',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-farmer.component.html',
  styleUrl: './add-farmer.component.scss',
})
export class AddFarmerComponent implements OnInit {
  searchForm!: FormGroup;
  registerForm!: FormGroup;
  counties: County[] = [];
  sub_counties: SubCounty[] = [];
  wards: Ward[] = [];
  groups = [];
  breadCrumbItems: any;
  valueChains = [];

  // trials: any = countyData
  genders: any = [{ name: 'Female' }, { name: 'Male' }];
  options: any = [{ name: 'true' }, { name: 'false' }];
  public ColumnMode = ColumnMode;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private farmersService: FarmersService,
    private groupsService: GroupsService,
    private vlcService: VlcService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.counties = counties;

    this.breadCrumbItems = [
      { label: 'Farmers' },
      { label: 'Add Farmer', active: true },
    ];

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      msisdn: ['', Validators.required],
      wardId: [[], Validators.required],
      lastName: ['', Validators.required],
      groupId: ['', Validators.required],
      idNumber: ['', Validators.required],
      dob: [this.formatDate(new Date()), Validators.required],
      gender: ['', Validators.required],
      valueChains: ['', Validators.required],
      disabled: ['', Validators.required],
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
    });

    this.getValueChains();
  }

  getWardId(event: any) {
    // if(event != undefined) {
    //     this.service.getMembersByWard(event.ward_id).subscribe((res) => {
    //         console.log(res)
    //     })
    // }
    this.getWardGroups();
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

  getWardGroups() {
    let obj = {
      countyId: [],
      subCountyId: [],
      wardId: [this.registerForm.get('wardId')?.value],
      startDate: '',
      endDate: '',
    };
    // this.spinner.show()
    this.groupsService.getGroupsByLocation(obj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.groups = res.message;
        console.log(res, 'groups');
      }
    });
  }

  filterGroups(data: any) {
    if (this.registerForm) {
      let obj = {
        countyId: this.registerForm.get('countyId')?.value,
        subCountyId: this.registerForm.get('subCountyId')?.value,
        wardId: this.registerForm.get('wardId')?.value,
        startDate: this.registerForm.get('startDate')?.value
          ? this.searchForm.get('startDate')?.value
          : '',
        endDate: this.registerForm.get('endDate')?.value
          ? this.searchForm.get('endDate')?.value
          : '',
      };
      this.groupsService.getGroupsByLocation(obj).subscribe((res) => {
        if (res.statusCode == 200) {
          this.groups = res.message;
          this.cdr.markForCheck();
          console.log(this.groups);
        }
      });
    }
  }

  getWards(event: Event) {
    this.getWardGroups();
  }

  onsubmit() {
    // this.spinner.show()
    let obj = {
      groupId: this.registerForm.get('groupId')?.value,
      wardId: this.registerForm.get('wardId')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      msisdn: this.registerForm.get('msisdn')?.value,
      idNumber: this.registerForm.get('idNumber')?.value,
      dob: this.registerForm.get('dob')?.value,
      gender: this.registerForm.get('gender')?.value,
      valueChains: this.registerForm.get('valueChains')?.value,
    };
    this.farmersService.addFarmer(obj).subscribe((res) => {
      // this.spinner.hide();
      // this.toastr.success('Added Successfully','Success');
      this.registerForm.reset();
      this.toastr.success('Success', 'Farmer Added');
    });
  }

  subCounties(event: any) {
    let ids = this.registerForm.get('countyId')?.value;
    console.log(ids);
    let filtered_array = this.counties.filter((obj: any) =>
      ids.includes(obj.county_id)
    );
    filtered_array.forEach((element) => {
      this.sub_counties = this.sub_counties.concat(element.sub_counties);
    });
  }

  filterWards(event: any) {
    let ids = this.registerForm.get('subCountyId')?.value;
    let filtered_array = this.sub_counties.filter((obj: any) =>
      ids.includes(obj.subCountyId)
    );
    filtered_array.forEach((element) => {
      this.wards = this.wards.concat(element.wards);
    });
  }

  getValueChains() {
    this.vlcService.getValueChains().subscribe((res) => {
      this.valueChains = res.message;
    });
  }
}
