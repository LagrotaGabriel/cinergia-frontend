import { Component, Input } from '@angular/core';
import { ClienteResponse } from '../../../models/ClienteResponse';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-detalhes-dados-endereco',
  templateUrl: './detalhes-dados-endereco.component.html',
  styleUrls: ['../dados.component.scss'],
  animations: [slideUpDownAnimation]
})
export class DetalhesDadosEnderecoComponent {
  dadosEndereco: boolean = false;
  @Input() cliente: ClienteResponse;

  protected expandeEndereco() {
    if (this.cliente?.endereco != null) {
      this.dadosEndereco = !this.dadosEndereco
    }
  }

  protected isEnderecoDisabled(): boolean {
    if (this.cliente?.endereco == null) return true;
    else return false;
  }
}
