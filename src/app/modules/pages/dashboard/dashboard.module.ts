import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { SharedModule } from '../../shared/shared.module';

import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    VisualizacaoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule
  ]
})
export class DashboardModule { }
