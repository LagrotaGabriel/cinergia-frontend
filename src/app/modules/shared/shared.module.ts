import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TituloComponent } from './titulo/titulo.component';
import { TabelaComponent } from './tabela/tabela.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

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
    BrowserModule
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
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class SharedModule { }
