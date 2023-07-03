import { Util } from './../../../modules/utils/Util';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { EmpresaService } from 'src/app/modules/pages/services/empresa.service';
import { TransferenciaService } from 'src/app/modules/pages/services/transferencia.service';
import { TransferenciaRequest } from 'src/app/modules/pages/transferencias/models/TransferenciaRequest';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mask } from 'src/app/modules/utils/Mask';

@Component({
  selector: 'app-nova-transferencia',
  templateUrl: './nova-transferencia.component.html',
  styleUrls: ['./nova-transferencia.component.scss']
})
export class NovaTransferenciaComponent {

  constructor(
    public dialogRef: MatDialogRef<NovaTransferenciaComponent>,
    private formBuilder: FormBuilder,
    private transferenciaService: TransferenciaService,
    private empresaService: EmpresaService,
    private snackBar: MatSnackBar) { }

  protected dadosTransferencia: FormGroup = this.createFormDadosTransferencia();
  stepAtual: number = 0;

  maxLengthChavePix: number = 14;

  createFormDadosTransferencia(): FormGroup {
    return this.formBuilder.group({
      valor: ['', Validators.required],
      chavePix: ['', [
        Validators.required,
        Validators.maxLength(14),
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
      ]],
      tipoChavePix: ['CPF', [Validators.required]],
      descricao: ['', [Validators.required]],
    });
  }

  protected getValueAtributoDadosTransferencia(atributo: string): any {
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
        text: 'Chave aleatória',
        value: 'EVP'
      }
    ]

    return options;
  }

  obtemDataHoje(): string {
    return Util.getHojeUs();
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
        .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
        .replace(/[^0-9.]/g, '')
        .trim())
  }

  mudaPasso(event) {
    this.stepAtual = event.selectedIndex;
  }

  fechaFormulario() {
    this.dialogRef.close();
  }

  enviaFormulario(stepper: MatStepper) {
    if (this.dadosTransferencia.valid) stepper.next();
    else this.dadosTransferencia.markAllAsTouched();
  }

  confirmaEnvioDeFormulario(stepper: MatStepper) {
    this.realizaAcionamentoDoMetodoDeCriacaoDeObjetoTransferencia();
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
    this.transferenciaService.novaTransferencia(this.realizaCriacaoDeObjetoTransferencia()).subscribe({
      error: (error: HttpErrorResponse) => {
        if (Util.isNotEmptyString(error?.error?.error)) {
          this.dadosTransferencia.reset();
          this.snackBar.open(error.error.error, 'Fechar', {
            duration: 3500
          });
        }
      },
      complete: () => {
        this.fechaFormulario();
      }
    })
  }
}
