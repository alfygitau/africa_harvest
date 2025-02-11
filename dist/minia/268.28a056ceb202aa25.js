"use strict";(self.webpackChunkminia=self.webpackChunkminia||[]).push([[268],{7268:(N,d,o)=>{o.r(d),o.d(d,{FarmersModule:()=>S});var h=o(177),u=o(8498),s=o(9417),v=o(3380),b=o(3165),m=o(3887),c=o(3682),e=o(4438),g=o(7148),p=o(5441),f=o(2768),F=o(5794),C=o(8548);const y=[{path:"add-farmer",component:(()=>{class l{constructor(i,t,r,a,n,j){this.formBuilder=i,this.cdr=t,this.farmersService=r,this.groupsService=a,this.vlcService=n,this.toastr=j,this.counties=[],this.sub_counties=[],this.wards=[],this.groups=[],this.valueChains=[],this.genders=[{name:"Female"},{name:"Male"}],this.options=[{name:"true"},{name:"false"}],this.ColumnMode=v.oZ}ngOnInit(){this.counties=b.v,this.breadCrumbItems=[{label:"Farmers"},{label:"Add Farmer",active:!0}],this.registerForm=this.formBuilder.group({firstName:["",s.k0.required],msisdn:["",s.k0.required],wardId:[[],s.k0.required],lastName:["",s.k0.required],groupId:["",s.k0.required],idNumber:["",s.k0.required],dob:[this.formatDate(new Date),s.k0.required],gender:["",s.k0.required],valueChains:["",s.k0.required],disabled:["",s.k0.required],countyId:[[],s.k0.required],subCountyId:[[],s.k0.required]}),this.getValueChains()}getWardId(i){this.getWardGroups()}formatDate(i){let t=new Date(i),r=""+(t.getMonth()+1),a=""+t.getDate(),n=t.getFullYear();return r.length<2&&(r="0"+r),a.length<2&&(a="0"+a),[n,r,a].join("-")}getWardGroups(){let i={countyId:[],subCountyId:[],wardId:[this.registerForm.get("wardId")?.value],startDate:"",endDate:""};this.groupsService.getGroupsByLocation(i).subscribe(t=>{200==t.statusCode&&(this.groups=t.message,console.log(t,"groups"))})}filterGroups(i){if(this.registerForm){let t={countyId:this.registerForm.get("countyId")?.value,subCountyId:this.registerForm.get("subCountyId")?.value,wardId:this.registerForm.get("wardId")?.value,startDate:this.registerForm.get("startDate")?.value?this.searchForm.get("startDate")?.value:"",endDate:this.registerForm.get("endDate")?.value?this.searchForm.get("endDate")?.value:""};this.groupsService.getGroupsByLocation(t).subscribe(r=>{200==r.statusCode&&(this.groups=r.message,this.cdr.markForCheck(),console.log(this.groups))})}}getWards(i){this.getWardGroups()}onsubmit(){let i={groupId:this.registerForm.get("groupId")?.value,wardId:this.registerForm.get("wardId")?.value,firstName:this.registerForm.get("firstName")?.value,lastName:this.registerForm.get("lastName")?.value,msisdn:this.registerForm.get("msisdn")?.value,idNumber:this.registerForm.get("idNumber")?.value,dob:this.registerForm.get("dob")?.value,gender:this.registerForm.get("gender")?.value,valueChains:this.registerForm.get("valueChains")?.value};this.farmersService.addFarmer(i).subscribe(t=>{this.registerForm.reset(),this.toastr.success("Success","Farmer Added")})}subCounties(i){let t=this.registerForm.get("countyId")?.value;console.log(t),this.counties.filter(a=>t.includes(a.county_id)).forEach(a=>{this.sub_counties=this.sub_counties.concat(a.sub_counties)})}filterWards(i){let t=this.registerForm.get("subCountyId")?.value;this.sub_counties.filter(a=>t.includes(a.subCountyId)).forEach(a=>{this.wards=this.wards.concat(a.wards)})}getValueChains(){this.vlcService.getValueChains().subscribe(i=>{this.valueChains=i.message})}static#e=this.\u0275fac=function(t){return new(t||l)(e.rXU(s.ok),e.rXU(e.gRc),e.rXU(g.s),e.rXU(p.U),e.rXU(f.d),e.rXU(F.tw))};static#t=this.\u0275cmp=e.VBU({type:l,selectors:[["app-add-farmer"]],standalone:!0,features:[e.aNF],decls:70,vars:21,consts:[["title","Farmers",3,"breadcrumbItems"],[1,"card"],[1,"card-body"],[3,"formGroup","ngSubmit"],[1,"row"],[1,"col-md-3"],[1,"form-group"],["bindLabel","name","bindValue","county_id","placeholder","Select County","formControlName","countyId",3,"items","multiple","virtualScroll","change"],["bindLabel","name","bindValue","subCountyId","placeholder","Select Sub County","formControlName","subCountyId",3,"items","multiple","virtualScroll","change"],["bindLabel","name","bindValue","wardId","placeholder","Select Ward","formControlName","wardId",3,"items","multiple","virtualScroll","change"],["bindLabel","group_name","bindValue","group_id","placeholder","Group","formControlName","groupId",3,"items","virtualScroll"],[1,"col-md-6"],["bindLabel","name","bindValue","name","placeholder","Select Gender","formControlName","gender",3,"items","virtualScroll"],["bindLabel","name","bindValue","name","placeholder","Select Option","formControlName","disabled",3,"items","virtualScroll"],[1,"form-group","position-relative"],["type","text","placeholder","First Name","formControlName","firstName",1,"form-control"],["type","text","placeholder","Last Name","formControlName","lastName",1,"form-control"],["type","date","formControlName","dob",1,"form-control"],["type","text","placeholder","Mobile No","formControlName","msisdn",1,"form-control"],["type","text","placeholder","Id no.","formControlName","idNumber",1,"form-control"],["bindLabel","value_chain_name","bindValue","value_chain_id","placeholder","Select Value Chain","formControlName","valueChains",3,"items","virtualScroll","multiple"],[1,"col-sm-12"],["type","submit",1,"btn","btn-primary","mt-2",3,"disabled"]],template:function(t,r){1&t&&(e.nrm(0,"app-pagetitle",0),e.j41(1,"div")(2,"div",1)(3,"div",2)(4,"form",3),e.bIt("ngSubmit",function(){return r.onsubmit()}),e.j41(5,"div",4)(6,"div",5)(7,"div",6)(8,"label"),e.EFF(9,"County"),e.k0s(),e.j41(10,"ng-select",7),e.bIt("change",function(n){return r.subCounties(n)}),e.k0s()()(),e.j41(11,"div",5)(12,"div",6)(13,"label"),e.EFF(14,"Sub-county"),e.k0s(),e.j41(15,"ng-select",8),e.bIt("change",function(n){return r.filterWards(n)}),e.k0s()()(),e.j41(16,"div",5)(17,"div",6)(18,"label"),e.EFF(19,"Ward"),e.k0s(),e.j41(20,"ng-select",9),e.bIt("change",function(n){return r.filterGroups(n)}),e.k0s()()(),e.j41(21,"div",5)(22,"label"),e.EFF(23,"Group"),e.k0s(),e.j41(24,"div",6),e.nrm(25,"ng-select",10),e.k0s()()(),e.j41(26,"div",4)(27,"div",11)(28,"label"),e.EFF(29,"Gender"),e.k0s(),e.j41(30,"div",6),e.nrm(31,"ng-select",12),e.k0s()(),e.j41(32,"div",11)(33,"label"),e.EFF(34,"Disabled"),e.k0s(),e.j41(35,"div",6),e.nrm(36,"ng-select",13),e.k0s()(),e.j41(37,"div",11)(38,"label"),e.EFF(39,"First Name"),e.k0s(),e.j41(40,"fieldset",14),e.nrm(41,"input",15),e.k0s()(),e.j41(42,"div",11)(43,"label"),e.EFF(44,"Last Name"),e.k0s(),e.j41(45,"fieldset",14),e.nrm(46,"input",16),e.k0s()(),e.j41(47,"div",11)(48,"label"),e.EFF(49,"Date of Birth"),e.k0s(),e.j41(50,"fieldset",14),e.nrm(51,"input",17),e.k0s()(),e.j41(52,"div",11)(53,"label"),e.EFF(54,"Mobile No"),e.k0s(),e.j41(55,"fieldset",14),e.nrm(56,"input",18),e.k0s()(),e.j41(57,"div",11)(58,"label"),e.EFF(59,"Id No"),e.k0s(),e.j41(60,"fieldset",14),e.nrm(61,"input",19),e.k0s()(),e.j41(62,"div",11)(63,"label"),e.EFF(64,"Value Chains"),e.k0s(),e.j41(65,"div",6),e.nrm(66,"ng-select",20),e.k0s()(),e.j41(67,"div",21)(68,"button",22),e.EFF(69," Save "),e.k0s()()()()()()()),2&t&&(e.Y8G("breadcrumbItems",r.breadCrumbItems),e.R7$(4),e.Y8G("formGroup",r.registerForm),e.R7$(6),e.Y8G("items",r.counties)("multiple",!0)("virtualScroll",!0),e.R7$(5),e.Y8G("items",r.sub_counties)("multiple",!0)("virtualScroll",!0),e.R7$(5),e.Y8G("items",r.wards)("multiple",!0)("virtualScroll",!0),e.R7$(5),e.Y8G("items",r.groups)("virtualScroll",!0),e.R7$(6),e.Y8G("items",r.genders)("virtualScroll",!0),e.R7$(5),e.Y8G("items",r.options)("virtualScroll",!0),e.R7$(30),e.Y8G("items",r.valueChains)("virtualScroll",!0)("multiple",!0),e.R7$(2),e.Y8G("disabled",r.registerForm.invalid))},dependencies:[m.G,C.T,s.X1,s.qT,s.me,s.BC,s.cb,s.j4,s.JD,c.MQ,c.vr]})}return l})()}];let I=(()=>{class l{static#e=this.\u0275fac=function(t){return new(t||l)};static#t=this.\u0275mod=e.$C({type:l});static#r=this.\u0275inj=e.G2t({imports:[u.iI.forChild(y),u.iI]})}return l})(),S=(()=>{class l{static#e=this.\u0275fac=function(t){return new(t||l)};static#t=this.\u0275mod=e.$C({type:l});static#r=this.\u0275inj=e.G2t({providers:[g.s],imports:[h.MD,I,m.G]})}return l})()}}]);