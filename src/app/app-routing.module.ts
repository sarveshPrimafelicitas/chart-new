import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductPasportRoutingModule } from './components/product-pasport-routing.module';
import { FetchingDataComponent } from './components/fetching-data/fetching-data.component';
import { ShowChartComponent } from './components/show-chart/show-chart.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'product-passport/aw_qrnwrt/:id',
    component: FetchingDataComponent,
    // loadChildren: () =>
    //   import('./components/product-pasport.module').then(
    //     (m) => m.ProductPasportModule
    //   ),
  },
  { path: 'chart', component: ShowChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
