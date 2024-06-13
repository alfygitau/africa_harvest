import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedsDistributionComponent } from './seeds-distribution.component';

describe('SeedsDistributionComponent', () => {
  let component: SeedsDistributionComponent;
  let fixture: ComponentFixture<SeedsDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedsDistributionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeedsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
