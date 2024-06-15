import { counties } from './../../shared/data/Counties';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { County } from '../../shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoursesService } from '../courses.service';
import { VlcService } from 'src/app/vlc/vlc.service';
import { GroupsService } from 'src/app/core/services/groups.service';
import { TotsService } from 'src/app/tots/tots.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-training',
    standalone: true,
    templateUrl: './add-training.component.html',
    styleUrl: './add-training.component.scss',
    imports: [SharedModule, NgSelectModule, ReactiveFormsModule]
})
export class AddTrainingComponent implements OnInit {
  breadCrumbItems: any;
  registerForm!:FormGroup;
  searchForm!:FormGroup
  imageFile!:File
  trainers: any=[{"name":"AH"}, {"name":"ACRISTAT"}]
  trainingType: any=[{"name":"TOT"}, {"name":"FARMERS"}]
  courses=[]
  valueChains=[]
  allSubCounties=[]
  wards:Ward[]=[]
  wardId!: number
  wardMembers=[]
  courseModules=[]
  groups=[]
  sub_counties: SubCounty[]=[]
  counties: County[]=[]
  members=[]
  userId!: any

  constructor(
    private formBuilder:FormBuilder,
    private coursesService:CoursesService,
    private vlcService:VlcService,
    private groupsService:GroupsService,
    private totsService:TotsService,
    private toastr:ToastrService){
      this.userId = sessionStorage.getItem('userId')
    }

  ngOnInit(): void {
    this.counties = counties

    this.breadCrumbItems = [
      { label: 'Courses' },
      { label: 'Add Training', active: true }
    ];

    this.registerForm = this.formBuilder.group({
      trainingType: ['', Validators.required],
      venue: ['', Validators.required],
      userId: this.userId,
      courseId: ['', Validators.required],
      courseModuleId: 1,
      valueChainId:['', Validators.required],
      attendanceSheetPhotoUrl: ['', Validators.required],
      traineesPhotoUrl: ['', Validators.required],
      feedback: ['', Validators.required],
      membersIds:[[], Validators.required],
      nextTrainingDate:['', Validators.required],
      wardId: ['', Validators.required]
    });

    this.searchForm = this.formBuilder.group({
        countyId: ['', Validators.required],
        subCountyId: ['', Validators.required],
        wardId: ['', Validators.required],
        groupId: ['', Validators.required]
    })

    //functions
    this.getCourses()
    this.geValueChainList()
  }


subCounties(event: Event) {
  let ids = this.searchForm.get('countyId')?.value
  console.log(ids)
   let filtered_array=this.counties.filter((obj:any)=>ids.includes(obj.county_id))
   filtered_array.forEach((element:County) => {
     this.sub_counties=this.sub_counties.concat(element.sub_counties)
   });
}

getWards(event:Event){
  let ids = this.searchForm.get('subCountyId')?.value 
  let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
  filtered_array.forEach(element => {
    this.wards=this.wards.concat(element.wards)
  })
}

onFileChange(event: any) {
  if(event.target.files.length > 0) {
    const file = event.target.files[0]
    this.imageFile = file
  }
}

onSubmit(){
  this.coursesService.addTraining(this.registerForm.value).subscribe((res) => {
    if(res.statusCode == 201) {
      this.registerForm.reset()
      this.toastr.success("Success", "Training Added")
    } else {
      this.toastr.warning("Error", res.message)
    }
  })
}

  filterAtttendees(event: any) {
    let type = this.registerForm.get('trainingType')?.value

    if(type == 'FARMERS') {
        this.getFarmers(this.searchForm.get('groupId')?.value)
    } else {
        this.getWardTots(this.searchForm.get('wardId')?.value)
    }
  }

  getWardTots(data: any) {
    this.totsService.getWardToTs(data).subscribe((res) => {
        if(res.statusCode == 200) {
            this.wardMembers = res.message
        }
    })
  }

  geValueChainList() {
      this.vlcService.getValueChains().subscribe((res) => {
        if(res.statusCode == 200) {
          this.valueChains = res.message
        }
      })
  }

  getCourseModules(event:any) {
    if(event != undefined) {
        this.coursesService.getCourseModules(event.course_id).subscribe((res) => {
            if(res.message) {
                this.courseModules = res.message 
            }
        })
    }
  }

  getCourses() {
    this.coursesService.getCoursesList().subscribe((res) => {
      if(res.statusCode == 200) {
        this.courses=res.message
      }
    })
  }

  getGroupMembers(event: any) {
    this.registerForm.patchValue({'wardId': event.ward_id}) 

    console.log(this.registerForm.value)
    if(event != undefined) {
        // this.service.getMembersByWard(event.ward_id).subscribe((res) => {
        //     if(res.statusCode == 200) {
        //         this.spinner.hide()
        //         this.wardMembers = res.message.members    
        //         console.log(this.wardMembers)
        //     }
        // })
        this.getFarmers(event[0].ward_id)
    }

    // this.filterGroups(this.searchForm.value)

    // this.filterGroupsByWards(this.searchForm.value)
  }

  getFarmers(data: any) {
    this.groupsService.getGroupMembers(data).subscribe((res) => {
        if(res.statusCode == 200) {
            this.members = res.message.members    
        }
    })
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
          console.log(res)
          if(res.statusCode == 200) {
              this.groups = res.message 
          }
      })

    }

  }  
}
