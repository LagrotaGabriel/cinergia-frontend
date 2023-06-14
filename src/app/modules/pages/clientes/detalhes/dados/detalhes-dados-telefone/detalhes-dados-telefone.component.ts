import { Component, Input } from '@angular/core';
import { ClienteResponse } from '../../../models/ClienteResponse';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-detalhes-dados-telefone',
  templateUrl: './detalhes-dados-telefone.component.html',
  styleUrls: ['../dados.component.scss'],
  animations: [slideUpDownAnimation]
})
export class DetalhesDadosTelefoneComponent {
  dadosTelefone: boolean = false;
  @Input() cliente: ClienteResponse;

  protected expandeTelefone() {
    if (this.cliente?.telefones != null && this.cliente?.telefones?.length > 0) {
      this.dadosTelefone = !this.dadosTelefone
    }
  }

  protected isTelefoneDisabled(): boolean {
    if (this.cliente?.telefones == null || this.cliente?.telefones?.length == 0) return true;
    else return false;
  }
}
