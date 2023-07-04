import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { Mask } from 'src/app/modules/utils/Mask';
import { NovaTransferenciaComponent } from '../nova-transferencia.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TransferenciaRequest } from 'src/app/modules/pages/transferencias/models/TransferenciaRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { Util } from 'src/app/modules/utils/Util';
import { TransferenciaService } from 'src/app/modules/pages/services/transferencia.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dados-pix',
  templateUrl: './dados-pix.component.html',
  styleUrls: ['./dados-pix.component.scss']
})
export class DadosPixComponent {

  constructor(
    public dialogRef: MatDialogRef<NovaTransferenciaComponent>) { }

  @Input() stepAtual;
  @Input() dadosTransferencia: FormGroup;

  maxLengthChavePix: number = 14;

  protected getValueAtributoDadosTransferencia(atributo: string): any {
    if (atributo == 'valor') return this.dadosTransferencia.controls[atributo].value.replace(',', '.');
    return this.dadosTransferencia.controls[atributo].value;
  }

  protected setValueParaAtributoDadosTransferencia(atributo: string, valor: any) {
    this.dadosTransferencia.controls[atributo].setValue(valor);
  }

  geraOptionsTipoChavePix(): SelectOption[] {

    let options: SelectOption[];

    options = [
      {
        text: 'Cpf',
        value: 'CPF'
      },
      {
        text: 'Cnpj',
        value: 'CNPJ'
      },
      {
        text: 'Telefone',
        value: 'PHONE'
      },
      {
        text: 'E-mail',
        value: 'EMAIL'
      },
      {
        text: 'Chave aleatória',
        value: 'EVP'
      }
    ]

    return options;
  }

  protected alteraTipoChavePix() {

    let tipoChavePix: string = this.getValueAtributoDadosTransferencia('tipoChavePix');

    this.dadosTransferencia.controls['chavePix'].setValue('');

    switch (tipoChavePix) {
      case 'CPF': {
        this.dadosTransferencia.controls['chavePix'].setValidators([
          Validators.required,
          Validators.maxLength(14),
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
        ]);
        this.maxLengthChavePix = 14;
        break;
      }
      case 'CNPJ': {
        this.dadosTransferencia.controls['chavePix'].setValidators([
          Validators.required,
          Validators.maxLength(18),
          Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
        ]);
        this.maxLengthChavePix = 18;
        break;
      }
      case 'PHONE': {
        this.dadosTransferencia.controls['chavePix'].setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ]);
        this.maxLengthChavePix = 11;
        break;
      }
      case 'EMAIL': {
        this.dadosTransferencia.controls['chavePix'].setValidators([
          Validators.required,
          Validators.email,
          Validators.maxLength(60),
        ]);
        this.maxLengthChavePix = 60;
        break;
      }
      case 'EVP': {
        this.dadosTransferencia.controls['chavePix'].setValidators([
          Validators.required,
          Validators.minLength(35),
          Validators.maxLength(35),
          Validators.pattern(/^[a-zA-Z\d]{7}\-[a-zA-Z\d]{4}\-[a-zA-Z\d]{4}\-[a-zA-Z\d]{4}\-[a-zA-Z\d]{12}$/)
        ]);
        this.maxLengthChavePix = 35;
        break;
      }
    }

  }

  protected realizaTratamentoChavePix(tecla) {
    let chavePix: string = this.getValueAtributoDadosTransferencia('chavePix')

    if (this.getValueAtributoDadosTransferencia('tipoChavePix') == 'CPF' && tecla?.inputType != 'deleteContentBackward'
      || this.getValueAtributoDadosTransferencia('tipoChavePix') == 'CPF' && tecla == null) {
      chavePix = Mask.cpfMask(chavePix);
    }
    else if (this.getValueAtributoDadosTransferencia('tipoChavePix') == 'CNPJ' && tecla?.inputType != 'deleteContentBackward'
      || this.getValueAtributoDadosTransferencia('tipoChavePix') == 'CNPJ' && tecla == null) {
      chavePix = Mask.cnpjMask(chavePix);
    }
    else if (this.getValueAtributoDadosTransferencia('tipoChavePix') == 'PHONE'
      || this.getValueAtributoDadosTransferencia('tipoChavePix') == 'PHONE' && tecla == null) {
      chavePix = chavePix
        .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
        .replace(/[^0-9.]/g, '')
        .trim();
    }
    else if (this.getValueAtributoDadosTransferencia('tipoChavePix') == 'EVP' && tecla?.inputType != 'deleteContentBackward'
      || this.getValueAtributoDadosTransferencia('tipoChavePix') == 'EVP' && tecla == null) {
      chavePix = Mask.evpMask(chavePix);
    }

    this.setValueParaAtributoDadosTransferencia('chavePix', chavePix);
  }

  protected realizaTratamentoValor() {
    this.dadosTransferencia.controls['valor']
      .setValue(this.getValueAtributoDadosTransferencia('valor')
        .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%;':*?<>{}-]/g, "")
        .replace(/[^0-9.]/g, '')
        .trim())
  }

}
