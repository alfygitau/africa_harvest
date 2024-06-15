import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupsService } from 'src/app/core/services/groups.service';
import { County } from 'src/app/shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { counties } from 'src/app/shared/data/Counties';
import { CoursesService } from '../courses.service';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { offset } from '@popperjs/core';

export interface TrainingData {
  training_id: number, 
  name: string, 
  course: string, 
  course_module: string,
  training_date: string,
  next_training_date: string,
  total_members_trained: number,
  training_type: string,
  value_chain_name: string,
  value_chain_id: number,
}

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [
    SharedModule, 
    ReactiveFormsModule,
    NgSelectModule, 
    FormsModule, 
    NgxDatatableModule,
    CommonModule
  ],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit, AfterViewInit {
  ColumnMode= ColumnMode;
  breadCrumbItems: any;
  searchForm!: FormGroup;
  counties: County[]=[]
  sub_counties: SubCounty[] = []
  wards: Ward[] = []
  groups=[]
  trainings=[]
  currentPage:number=1
  dataParams: any = {  
    page_num: '',  
    page_size: ''  
  }; 


  constructor(  
    private groupsService:GroupsService,
    private cdr:ChangeDetectorRef,
    private formBuilder:FormBuilder,
    private coursesService:CoursesService){}

  ngOnInit(): void {
    const date = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1)
    this.dataParams.page_num = 0
    this.dataParams.page_size = 8
    this.counties = counties

    this.breadCrumbItems = [
      { label: 'Courses' },
      { label: 'Trainings', active: true }
    ];

    this.searchForm = this.formBuilder.group({
      countyId: [[], Validators.required],
      subCountyId: [[], Validators.required],
      wardId: [[], Validators.required],
      groupId: [[], Validators.required],
      startDate:[this.formatDate(startDate), Validators.required],
      endDate:[this.formatDate(date), Validators.required],
    });
      

    this.getTrainings()
    this.setPage({ offset: 0 })
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

  ngAfterViewInit(): void {


  }

  viewDetails(row: any){

  }

  setPage(pageInfo: any) {
    // this.p = pageInfo.offset;
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }

  search(){
    console.log(this.searchForm.value)
  }

  getTrainings() {
    this.coursesService.getTrainings(this.dataParams.page_num).subscribe((res) => {
      console.log(res)
      if(res.statusCode == 200) {
        this.trainings = res.message.trainings
        // this.dataSource.data = this.trainings
        this.cdr.markForCheck()
      }

      console.log(this.trainings)
    })
  }

  subCounties(event:Event) {
    if(this.searchForm) {
      let ids = this.searchForm.get('countyId')?.value
      let filtered_array=this.counties.filter((obj:any)=>ids.includes(obj.county_id))
      filtered_array.forEach(element => {
        this.sub_counties = this.sub_counties.concat(element.sub_counties)
     });
    }
  }


  getWards(event:Event) {
    if(this.searchForm) {
      let ids = this.searchForm.get('subCountyId')?.value 
      let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
      filtered_array.forEach(element => {
        this.wards=this.wards.concat(element.wards)
      })
    }
  }


  filterGroups(data: any) {
    if(this.searchForm) {
      let obj = {
          "countyId": this.searchForm.get('countyId')?.value,
          "subCountyId": this.searchForm.get('subCountyId')?.value,
          "wardId": this.searchForm.get('wardId')?.value,
          "startDate": this.searchForm.get('startDate')?.value ? this.searchForm.get('startDate')?.value: '',
          "endDate": this.searchForm.get('endDate')?.value ? this.searchForm.get('endDate')?.value : '',
      }
      this.groupsService.getGroupsByLocation(obj).subscribe((res) => {
          if(res.statusCode == 200) {
              this.groups = res.message 
              this.cdr.markForCheck()
          }
      })
    }
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}
