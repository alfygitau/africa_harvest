import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetModule } from './widget/widget.module';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { MatPaginatorModule} from '@angular/material/paginator';
// import { MatSortModule} from '@angular/material/sort';
// import { MatTableModule} from '@angular/material/table';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [

    PagetitleComponent
  ],
  imports: [
    CommonModule,
    WidgetModule,
    NgxDatatableModule,
    ToastrModule.forRoot(),
    NgbModule
    // MatFormFieldModule,
    // MatPaginatorModule,
    // MatPaginatorModule,
    // MatTableModule,
    // MatInputModule,
    // MatSortModule
  ],
  exports: [PagetitleComponent]
})
export class SharedModule { }
