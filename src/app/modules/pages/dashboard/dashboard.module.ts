import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { SharedModule } from '../../shared/shared.module';

import { MatIconModule } from '@angular/material/icon';

import { NgApexchartsModule } from 'ng-apexcharts'; 



@NgModule({
  declarations: [
    VisualizacaoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    NgApexchartsModule
  ]
})
export class DashboardModule { }
