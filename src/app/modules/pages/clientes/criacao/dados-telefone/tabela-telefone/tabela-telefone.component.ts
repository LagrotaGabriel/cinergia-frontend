import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/shared/animations';
import { Telefone } from 'src/app/shared/models/Telefone';

@Component({
  selector: 'app-tabela-telefone',
  templateUrl: './tabela-telefone.component.html',
  styleUrls: ['./tabela-telefone.component.scss'],
  animations: [fadeInOutAnimation]
})
export class TabelaTelefoneComponent {

  @Input() telefones: Telefone[] = [];

  @Output() emissorDeRemocaoDeTelefone = new EventEmitter<Telefone>;

  removeTelefone(telefone: Telefone) {
    this.emissorDeRemocaoDeTelefone.emit(telefone);
  }

}
