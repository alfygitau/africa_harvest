import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TotsService } from '../tots.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tot-profile',
  standalone: true,
  imports: [
    SharedModule,
    NgbModule
  ],
  templateUrl: './tot-profile.component.html',
  styleUrl: './tot-profile.component.scss'
})
export class TotProfileComponent implements OnInit {

  userId!: any
  breadCrumbItems:any
  activeId!: number

  constructor(
    private route:ActivatedRoute,
    private cdr:ChangeDetectorRef,
    private totService:TotsService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.activeId = 1
    this.route.params.subscribe(
      (params:Params) => {
        this.userId = +params['id']
      }
    )

    this.breadCrumbItems = [
      { label: 'Profile' },
      { label: 'ToT Profile', active: true }
    ];

    this.getTotDetails()
  }

  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true, windowClass: 'modal-holder' });
  }

  // @param content
  openModal(content: any) {
    this.modalService.open(content);
  }

  getTotDetails(){
    this.totService.getUserProfile(this.userId).subscribe((res) => {
      console.log(res)
    })
  }

}
