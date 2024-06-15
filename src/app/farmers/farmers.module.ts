import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmersRoutingModule } from './farmers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FarmersService } from './farmers.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, FarmersRoutingModule, SharedModule],
  providers: [FarmersService],
})
export class FarmersModule {}
