import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductPasportRoutingModule } from './product-pasport-routing.module';
import { FetchingDataComponent } from './fetching-data/fetching-data.component';

@NgModule({
  imports: [
    CommonModule,
    ProductPasportRoutingModule,
    NgOptimizedImage,
    FetchingDataComponent,
  ],
})
export class ProductPasportModule {}
