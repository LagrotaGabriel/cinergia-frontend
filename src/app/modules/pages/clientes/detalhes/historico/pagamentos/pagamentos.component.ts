import { Component, Input } from '@angular/core';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
  animations: [slideUpDownAnimation]
})
export class PagamentosComponent {

  @Input() abaSelecionada;

}
