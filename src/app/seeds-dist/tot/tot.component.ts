import { Component, OnInit } from '@angular/core';
import { County } from '../../shared/data/county.model';
import { SubCounty } from '../../shared/data/subCounty.model';
import { Ward } from '../../shared/data/ward.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VlcService } from 'src/app/vlc/vlc.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

export interface SeedDetails {
  batchNo: number;
  pricePerUnit: number;
  seedVariety: string;
  seedWeight: number;
  valueChainId: number; 
}

@Component({
  selector: 'app-tot',
  standalone: true,
  imports: [NgSelectModule, SharedModule, ReactiveFormsModule],
  templateUrl: './tot.component.html',
  styleUrl: './tot.component.scss'
})
export class TotComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  counties: County[]=[]
  sub_counties: SubCounty[] = []
  wards: Ward[] = []
  registerForm!: FormGroup;
  valueChainForm!:FormGroup
  valueChains=[]
  distributor: any=[{"name":"AH"}, {"name":"ICRISAT"}]
  recipient: any=[{"name":"ToT"}]
  selectedVcs: SeedDetails[] = []
  seedVarieties=[]
  userId!: any

  constructor(
    private formBuilder:FormBuilder,
    private vlcService:VlcService){
      this.userId = sessionStorage.getItem('userId')
    }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Seeds Distribution' },
      { label: 'ToTs', active: true }
    ];


    this.valueChainForm = this.formBuilder.group({
      valueChainId:['', Validators.required],
      seedVariety: ['', Validators.required],
      seedWeight:['', Validators.required],
      batchNo: ['', Validators.required],
      pricePerUnit:['', Validators.required]
    })

    this.registerForm = this.formBuilder.group({
      memberId: ['', Validators.required],
      userId: ['', Validators.required],
      image: ['', Validators.required],
      recipientType:['', Validators.required],
      distributor: ['', Validators.required],
      wardId: ['', Validators.required],
      // distributor: ['', Validators.required]
    })

    this.getSeedVarieties()
    this.getValueChains()
      
  }

  onsubmit() {   
    let dataObject = {
        "idNumber":"",
        "userId": this.userId,
        "image": this.registerForm.get('image')?.value,
        "recipientType": this.registerForm.get('recipientType')?.value,
        "distributor": this.registerForm.get('distributor')?.value,
        "wardId": this.registerForm.get('wardId')?.value,
        "vc": this.selectedVcs,
    }

    this.vlcService.createSeedDistribution(dataObject).subscribe((res) => {
       if(res.statusCode == 417) {
        // this.toastr.success("User does not Exist", "Error")
       } else {
       }
    })
    
  }

  getSeedVarieties() {
    this.vlcService.getAllSeedVarieties().subscribe((res) => {
        if(res.statusCode == 200) {
            this.seedVarieties = res.message
        }
    })
  }

  getValueChains() {
    this.vlcService.getValueChains().subscribe((res) => {
        if(res.statusCode == 200) {
          this.valueChains = res.message
        }
    })

  }

  addVLC() {
    let data = {
      "batchNo": parseInt(this.valueChainForm.get('batchNo')?.value),
      "pricePerUnit":parseInt(this.valueChainForm.get('pricePerUnit')?.value),
      "seedVariety":this.valueChainForm.get('seedVariety')?.value,
      "seedWeight": parseInt(this.valueChainForm.get('seedWeight')?.value),
      "valueChainId": this.valueChainForm.get('valueChainId')?.value
    }
    this.selectedVcs.push(data)
    this.valueChainForm.reset()
  }

}
