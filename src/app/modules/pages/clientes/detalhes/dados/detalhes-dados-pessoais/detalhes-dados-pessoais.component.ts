import { Component, Input } from '@angular/core';
import { ClienteResponse } from '../../../models/ClienteResponse';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-detalhes-dados-pessoais',
  templateUrl: './detalhes-dados-pessoais.component.html',
  styleUrls: ['../dados.component.scss'],
  animations: [slideUpDownAnimation]
})
export class DetalhesDadosPessoaisComponent {
  dadosPessoais: boolean = false;
  @Input() cliente: ClienteResponse;
}
