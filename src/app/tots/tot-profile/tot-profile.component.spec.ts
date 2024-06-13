import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotProfileComponent } from './tot-profile.component';

describe('TotProfileComponent', () => {
  let component: TotProfileComponent;
  let fixture: ComponentFixture<TotProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
