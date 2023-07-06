import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NovaTransferenciaComponent } from '../nova-transferencia.component';
import { TransferenciaService } from 'src/app/modules/pages/services/transferencia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { TransferenciaRequest } from 'src/app/modules/pages/transferencias/models/TransferenciaRequest';
import { Util } from 'src/app/modules/utils/Util';

export class StatusTransferenciaPix {
  status: string;
  icone: string;
  texto: string;
  class: string;
}

@Component({
  selector: 'app-pix-finalizado',
  templateUrl: './pix-finalizado.component.html',
  styleUrls: ['./pix-finalizado.component.scss']
})
export class PixFinalizadoComponent {

  constructor(
    public dialogRef: MatDialogRef<NovaTransferenciaComponent>,
    private transferenciaService: TransferenciaService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let mudancaPaginaChanges = changes['stepAtual'];
    if (Util.isObjectEmpty(mudancaPaginaChanges)) return;
    if (!mudancaPaginaChanges.isFirstChange()) {
      if (mudancaPaginaChanges.currentValue == 2 && !this.transferenciaProcessada) {
        console.log('Método de transferência acionado');
        this.realizaAcionamentoDoMetodoDeCriacaoDeObjetoTransferencia();
      }
    }
  }

  @Input() stepAtual;

  @Input() transferenciaProcessada: boolean;
  @Output() emiteTransferenciaProcessada = new EventEmitter<boolean>;

  @Input() dadosTransferencia: FormGroup;

  statusTransferenciaPix: StatusTransferenciaPix = {
    status: 'Validando',
    icone: 'autorenew',
    texto: 'Só mais um momento! Estamos validando os dados da transferência',
    class: 'primary'
  }

  protected getValueAtributoDadosTransferencia(atributo: string): any {
    if (atributo == 'valor') return this.dadosTransferencia.controls[atributo].value.replace(',', '.');
    return this.dadosTransferencia.controls[atributo].value;
  }

  realizaCriacaoDeObjetoTransferencia(): TransferenciaRequest {
    let transferenciaRequest: TransferenciaRequest = {
      descricao: this.getValueAtributoDadosTransferencia('descricao'),
      valor: this.getValueAtributoDadosTransferencia('valor'),
      chavePix: this.getValueAtributoDadosTransferencia('chavePix'),
      tipoChavePix: this.getValueAtributoDadosTransferencia('tipoChavePix')
    }
    return transferenciaRequest;
  }

  realizaAcionamentoDoMetodoDeCriacaoDeObjetoTransferencia() {
    console.log('método acessado: ' + this.transferenciaProcessada);
    if (this.transferenciaProcessada) return;
    else {
      this.transferenciaService.novaTransferencia(this.realizaCriacaoDeObjetoTransferencia()).subscribe({
        error: (error: HttpErrorResponse) => {
          let text = 'Ops! Ocorreu uma falha na transferência. Tente novamente mais tarde';
          if (Util.isNotEmptyString(error?.error?.error)) text = error.error.error
          this.statusTransferenciaPix = {
            status: 'Erro',
            icone: 'cancel',
            texto: text,
            class: 'error'
          }
        },
        complete: () => {
          this.emiteTransferenciaProcessada.emit(true);
          this.statusTransferenciaPix = {
            status: 'Processando',
            icone: 'verified',
            texto: 'Sua transferência está sendo processada! Em breve você será notificado sobre seu status.',
            class: 'success'
          }
        }
      })
    }
  }

}
