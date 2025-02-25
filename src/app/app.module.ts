import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ShowChartComponent } from './show-chart/show-chart.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ShowChartComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
