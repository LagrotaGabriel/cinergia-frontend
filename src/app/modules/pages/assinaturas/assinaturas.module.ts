import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { CriacaoComponent } from './criacao/criacao.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    CriacaoComponent,
    DetalhesComponent,
    VisualizacaoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule
  ]
})
export class AssinaturasModule { }
