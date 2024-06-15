import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { County } from 'src/app/shared/data/county.model';
import { SubCounty } from 'src/app/shared/data/subCounty.model';
import { Ward } from 'src/app/shared/data/ward.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupsService } from '../groups.services';
import { NgSelectModule } from '@ng-select/ng-select';
import { counties } from 'src/app/shared/data/Counties';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent  implements OnInit {
  breadCrumbItems: any;
  registerForm!: FormGroup;
  searchForm!: FormGroup 
  allSubCounties=[]
  wardId!: number
  counties: County[]=[]
  sub_counties: SubCounty[] = []
  wards: Ward[] = []
  groups=[]
  userId!: any

  constructor(
    private groupsService:GroupsService,
    private cdr:ChangeDetectorRef,
    private formBuilder:FormBuilder,
    private toastr:ToastrService) {
      this.userId = sessionStorage.getItem('userId')
    }

  ngOnInit(): void {
    this.counties = counties

    this.breadCrumbItems = [
      { label: 'Groups' },
      { label: 'Add Group', active: true }
    ];
    
    this.registerForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.searchForm = this.formBuilder.group({
      countyId: ['', Validators.required],
      subCountyId: ['', Validators.required],
      wardId: ['', Validators.required]
    })
  }

  onSubmit(){ 
    let data = {
      "groupName": this.registerForm.get('groupName')?.value,
      "description": this.registerForm.get('description')?.value,
      "wardId": this.wardId,
      "userId": this.userId
    }
    this.groupsService.addGroup(data).subscribe(
      (res) => {
        if(res.statusCode == 201) {
          this.toastr.success("Group Added", "Success")
          this.registerForm.reset()
          this.searchForm.reset() 
        }
      })
  }

  filterGroups(data: any) {
    this.groupsService.getGroupsByLocation(data).subscribe((res) => {
        if(res.statusCode == 200) {
            this.groups = res.message 
            this.cdr.markForCheck()
        }
    })
  }

  getWards(event: any){
    let ids = this.searchForm.get('subCountyId')?.value 
    let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
    filtered_array.forEach(element => {
      this.wards=this.wards.concat(element.wards)
    })
  }

subCounties(event: any) {
    let ids = this.searchForm.get('countyId')?.value
     let filtered_array=this.counties.filter((obj:any)=>ids.includes(obj.county_id))
     filtered_array.forEach(element => {
       this.sub_counties=this.sub_counties.concat(element.sub_counties)
     });

 }

 filterWards(event: any) {
   let ids = this.searchForm.get('subCountyId')?.value 
   let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
   filtered_array.forEach(element => {
     this.wards=this.wards.concat(element.wards)
   })
 }

 getWardId(event: any) {
    this.wardId = event[0].wardId
 }

}
