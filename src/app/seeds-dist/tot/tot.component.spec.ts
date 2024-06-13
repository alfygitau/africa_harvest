import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotComponent } from './tot.component';

describe('TotComponent', () => {
  let component: TotComponent;
  let fixture: ComponentFixture<TotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
