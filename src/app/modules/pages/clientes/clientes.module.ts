import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { CriacaoComponent } from './criacao/criacao.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { DadosPessoaisComponent } from './criacao/dados-pessoais/dados-pessoais.component';
import { DadosTelefoneComponent } from './criacao/dados-telefone/dados-telefone.component';
import { DadosEnderecoComponent } from './criacao/dados-endereco/dados-endereco.component';
import { TabelaTelefoneComponent } from './criacao/dados-telefone/tabela-telefone/tabela-telefone.component';



@NgModule({
  declarations: [
    VisualizacaoComponent,
    DetalhesComponent,
    CriacaoComponent,
    DadosPessoaisComponent,
    DadosTelefoneComponent,
    DadosEnderecoComponent,
    TabelaTelefoneComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class ClientesModule { }
