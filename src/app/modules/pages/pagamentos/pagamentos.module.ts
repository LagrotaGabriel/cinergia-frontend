import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    VisualizacaoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PagamentosModule { }
