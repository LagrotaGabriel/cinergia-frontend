import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nova-transferencia',
  templateUrl: './nova-transferencia.component.html',
  styleUrls: ['./nova-transferencia.component.scss']
})
export class NovaTransferenciaComponent {

  constructor(
    public dialogRef: MatDialogRef<NovaTransferenciaComponent>,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnDestroy(): void {
    console.log(this.transferenciaProcessada);
    if (this.transferenciaProcessada) window.location.reload();
  }

  protected dadosTransferencia: FormGroup = this.createFormDadosTransferencia();
  protected transferenciaProcessada: boolean = false;

  stepAtual: number = 0;

  protected dadosConfirmacaoTransferencia: FormGroup = this.createFormDadosConfirmacaoTransferencia();

  createFormDadosConfirmacaoTransferencia(): FormGroup {
    return this.formBuilder.group({
      transferenciaConfirmada: [false, Validators.requiredTrue],
    });
  }

  mudaPasso(event) {
    this.stepAtual = event.selectedIndex;
  }

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

  enviaFormulario() {
    if (this.dadosTransferencia.invalid) this.dadosTransferencia.markAllAsTouched();
  }

  fechaFormulario() {
    this.dialogRef.close();
  }

  confirmaEnvioDeFormulario(stepper: MatStepper) {
    this.dadosConfirmacaoTransferencia.controls['transferenciaConfirmada'].setValue(true);
    stepper.next();
  }

  setaProcessamentoDaTransferenciaParaTrue(processada: boolean) {
    this.transferenciaProcessada = true;
  }

}
