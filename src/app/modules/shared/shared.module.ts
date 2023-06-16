import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TituloComponent } from './titulo/titulo.component';
import { TabelaComponent } from './tabela/tabela.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CabecalhoComponent } from './cabecalho/cabecalho.component';
import { PaginacaoComponent } from './paginacao/paginacao.component';
import { CustomInputComponent } from './custom-inputs/custom-input/custom-input.component';
import { CustomSelectComponent } from './custom-inputs/custom-select/custom-select.component';
import { CustomErrorComponent } from './custom-inputs/custom-error/custom-error.component';
import { CustomDateInputComponent } from './custom-inputs/custom-date-input/custom-date-input.component';
import { CustomTextareaComponent } from './custom-inputs/custom-textarea/custom-textarea.component';
import { CustomSelectBoxComponent } from './custom-inputs/custom-select-box/custom-select-box.component';



@NgModule({
  declarations: [
    TituloComponent,
    TabelaComponent,
    CabecalhoComponent,
    PaginacaoComponent,
    CustomInputComponent,
    CustomSelectComponent,
    CustomErrorComponent,
    CustomDateInputComponent,
    CustomTextareaComponent,
    CustomSelectBoxComponent,
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    MatBadgeModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  exports: [
    TituloComponent,
    TabelaComponent,
    CabecalhoComponent,
    PaginacaoComponent,
    CustomInputComponent,
    CustomSelectComponent,
    CustomDateInputComponent,
    CustomTextareaComponent,
    CustomSelectBoxComponent
  ]
})
export class SharedModule { }
