import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Africa Harvest';

  constructor(private spinner:NgxSpinnerService) {}
}
