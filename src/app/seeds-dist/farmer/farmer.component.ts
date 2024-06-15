import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { County } from '../../shared/data/county.model';
import { SubCounty } from '../../shared/data/subCounty.model';
import { Ward } from '../../shared/data/ward.model';
import { counties } from '../../shared/data/Counties';
import { VlcService } from 'src/app/vlc/vlc.service';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-farmer',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './farmer.component.html',
  styleUrl: './farmer.component.scss'
})
export class FarmerComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  valueChainForm!: FormGroup
  registerForm!: FormGroup;
  counties: County[]=[]
  sub_counties: SubCounty[] = []
  wards: Ward[] = []
  valueChains=[]
  seedVarieties=[]
  selectedVcs : any[]=[]
  userId!: any

  constructor(
    private formBuilder:FormBuilder,
    private vlcService:VlcService){
      this.userId = sessionStorage.getItem('userId')
    }


  ngOnInit(): void {
    this.counties = counties

    this.breadCrumbItems = [
      { label: 'Seeds Distribution' },
      { label: 'Farmer', active: true }
    ];

    this.valueChainForm = this.formBuilder.group({
      valueChainId:['', Validators.required],
      seedVariety: ['', Validators.required],
      seedWeight:['', Validators.required],
      batchNo: ['', Validators.required],
      pricePerUnit:['', Validators.required]
    })

    this.registerForm = this.formBuilder.group({
      idNumber: ['', Validators.required],
      userId: ['', Validators.required],
      image: ['', Validators.required],
      recipientType:['', Validators.required],
      distributor: ['', Validators.required],
      wardId: ['', Validators.required],
      countyId: ['', Validators.required],
      subCountyId: ['', Validators.required]
    })

    this.getValueChains()
    this.getSeedVarieties()
  }

  onsubmit() {
    let dataObject = {
      "idNumber": this.registerForm.get('idNumber')?.value,
      "userId": this.userId,
      "image": this.registerForm.get('image')?.value,
      "recipientType": "Farmer",
      "distributor": "TOT",
      "wardId": this.registerForm.get('wardId')?.value,
      "vc": this.selectedVcs,
    }

    this.vlcService.seedDistributionReg(dataObject).subscribe((res) => {
      if(res.statusCode == 200) {
        // this.
      }
    })
  }

  addVLC() {
    let data = {
      "batchNo": this.valueChainForm.get('batchNo')?.value,
      "pricePerUnit":parseInt(this.valueChainForm.get('pricePerUnit')?.value),
      "seedVariety":this.valueChainForm.get('seedVariety')?.value,
      "seedWeight": parseInt(this.valueChainForm.get('seedWeight')?.value),
      "valueChainId": this.valueChainForm.get('valueChainId')?.value
    }
    this.selectedVcs.push(data)
    this.valueChainForm.reset()
  }

  getValueChains() {
    // this.spinner.show()
    this.vlcService.getValueChains().subscribe((res) => {
      if(res.statusCode == 200) {
        this.valueChains = res.message
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

  getWards(event: any){
    let ids = this.registerForm.get('subCountyId')?.value 
    let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
    filtered_array.forEach(element => {
      this.wards=this.wards.concat(element.wards)
    })
  }

  subCounties(event: any) {
    let ids = this.registerForm.get('countyId')?.value
     let filtered_array=this.counties.filter((obj:any)=>ids.includes(obj.county_id))
     filtered_array.forEach(element => {
       this.sub_counties=this.sub_counties.concat(element.sub_counties)
     });
 }

 filterWards(event: any) {
   let ids = this.registerForm.get('subCountyId')?.value 
   let filtered_array = this.sub_counties.filter((obj: any) =>ids.includes(obj.subCountyId))
   filtered_array.forEach(element => {
     this.wards=this.wards.concat(element.wards)
   })
 } 

}

