import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChartComponent } from './show-chart.component';

describe('ShowChartComponent', () => {
  let component: ShowChartComponent;
  let fixture: ComponentFixture<ShowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
