import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from 'src/app/modules/utils/Util';
import { NovaTransferenciaComponent } from '../nova-transferencia.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirma-pix',
  templateUrl: './confirma-pix.component.html',
  styleUrls: ['./confirma-pix.component.scss']
})
export class ConfirmaPixComponent {

  constructor(
    public dialogRef: MatDialogRef<NovaTransferenciaComponent>,
    private formBuilder: FormBuilder) { }

  @Input() dadosTransferencia: FormGroup;
  @Input() stepAtual;
  @Input() dadosConfirmacaoTransferencia: FormGroup = this.createFormDadosConfrimacaoTransferencia();

  createFormDadosConfrimacaoTransferencia(): FormGroup {
    return this.formBuilder.group({
      transferenciaConfirmada: [false, Validators.requiredTrue],
    });
  }


  obtemDataHoje(): string {
    return Util.getHojeUs();
  }

  protected getValueAtributoDadosTransferencia(atributo: string): any {
    if (atributo == 'valor') return this.dadosTransferencia.controls[atributo].value.replace(',', '.');
    return this.dadosTransferencia.controls[atributo].value;
  }

  fechaFormulario() {
    this.dialogRef.close();
  }
}
