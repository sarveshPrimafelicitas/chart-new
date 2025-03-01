import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FetchingDataComponent } from './fetching-data/fetching-data.component';

const routes: Routes = [
  // {path:'', redirectTo:"fetchData"},
  // {path:'fetchData', component:FetchingDataComponent},
  { path: 'aw_qrnwrt/:id', component: FetchingDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPasportRoutingModule {}
