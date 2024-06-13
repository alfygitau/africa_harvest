// pagination.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';

@NgModule({
  declarations: [],
  imports: [PaginationComponent, CommonModule],
  exports: [PaginationComponent],
})
export class PaginationModule {}
