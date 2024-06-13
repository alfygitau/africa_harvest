import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupsService } from '../groups.services';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    SharedModule,
    NgxDatatableModule,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  group: any = {}
  rows=[]
  ColumnMode = ColumnMode;
  groupId!: number
  dataParams: any = {  
    page_num: '',  
    page_size: ''  
  }; 

  constructor(
    private route: ActivatedRoute,
    private cdr:ChangeDetectorRef,
    private router:Router,
    private groupsService:GroupsService
  ){  }

  ngOnInit(): void {
    this.dataParams.page_num = 0
    this.dataParams.page_size = 10  

    this.route.params.subscribe(
      (params:Params) => {
        this.groupId = +params['id']
      }
    )

    console.log(this.groupId)

    this.getGroupDetails()
    this.getGroupMembers()      
  }

  getGroupDetails() {
    this.groupsService.getGroupDetails(this.groupId).subscribe((res) => {
      if(res.statusCode == 200) {
        this.group = res.message
        this.updateBreadcrumbs() 
        this.cdr.markForCheck()
      }
    })
  }

  view(row: any){
    this.router.navigate(['/clients/details/',row.member_id])
  }

  getGroupMembers() {
    this.groupsService.getGroupMembers(this.groupId).subscribe((res) => {
      if(res.statusCode == 200) {
        this.rows=res.message
        this.cdr.detectChanges()
      }
    })
  }

  setPage(event: any) {

  }

  viewUserDetails(row:any) {
    this.router.navigate(['/clients/details/',row.member_id])
  }

  updateBreadcrumbs(){
    this.breadCrumbItems = [
      { label: 'Reports' },
      { label: `Group`, active: true }
    ];
  }


}
