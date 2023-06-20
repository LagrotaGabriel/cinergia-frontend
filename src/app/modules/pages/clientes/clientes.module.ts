import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { VisualizacaoComponent } from './visualizacao/visualizacao.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { CriacaoComponent } from './criacao/criacao.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { DadosPessoaisComponent } from './criacao/dados-pessoais/dados-pessoais.component';
import { DadosTelefoneComponent } from './criacao/dados-telefone/dados-telefone.component';
import { DadosEnderecoComponent } from './criacao/dados-endereco/dados-endereco.component';
import { TabelaTelefoneComponent } from './criacao/dados-telefone/tabela-telefone/tabela-telefone.component';
import { DadosComponent } from './detalhes/dados/dados.component';
import { HistoricoComponent } from './detalhes/historico/historico.component';
import { PagamentosComponent } from './detalhes/historico/pagamentos/pagamentos.component';
import { DetalhesDadosPessoaisComponent } from './detalhes/dados/detalhes-dados-pessoais/detalhes-dados-pessoais.component';
import { DetalhesDadosTelefoneComponent } from './detalhes/dados/detalhes-dados-telefone/detalhes-dados-telefone.component';
import { DetalhesDadosEnderecoComponent } from './detalhes/dados/detalhes-dados-endereco/detalhes-dados-endereco.component';
import { AssinaturasComponent } from './detalhes/historico/assinaturas/assinaturas.component';

import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    VisualizacaoComponent,
    DetalhesComponent,
    CriacaoComponent,
    DadosPessoaisComponent,
    DadosTelefoneComponent,
    DadosEnderecoComponent,
    TabelaTelefoneComponent,
    DadosComponent,
    HistoricoComponent,
    PagamentosComponent,
    DetalhesDadosPessoaisComponent,
    DetalhesDadosTelefoneComponent,
    DetalhesDadosEnderecoComponent,
    AssinaturasComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatMenuModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class ClientesModule { }
