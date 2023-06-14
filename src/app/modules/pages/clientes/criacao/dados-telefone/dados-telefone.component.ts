import { Subscription, debounceTime } from 'rxjs';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Telefone } from 'src/app/shared/models/Telefone';
import { CustomSelectComponent } from 'src/app/modules/shared/custom-inputs/custom-select/custom-select.component';
import { Util } from 'src/app/modules/utils/Util';
import { CustomInputComponent } from 'src/app/modules/shared/custom-inputs/custom-input/custom-input.component';
import { fadeInOutAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-dados-telefone',
  templateUrl: './dados-telefone.component.html',
  styleUrls: ['../criacao.component.scss', './dados-telefone.scss'],
  animations: [fadeInOutAnimation]
})
export class DadosTelefoneComponent {

  constructor(private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef) { }

  // Validations
  inputLengthPrefixo: number = 2;
  inputPrefixoPattern: any = /^\d{2}/;

  // Tags html
  @ViewChild('inputPrefixo') inputPrefixo: CustomInputComponent;

  @Input() stepAtual: number;
  @Input() telefoneEncontradoNoCnpj: Telefone[] = [];
  @Input() setupTelefonesAtualizacao: Telefone[] = [];

  protected dadosTelefone: FormGroup = this.createFormDadosTelefone();

  telefones: Telefone[] = [];
  @Output() emissorDeDadosDeTelefoneDoCliente = new EventEmitter<Telefone[]>();

  dadosTelefoneSubscribe$: Subscription = this.dadosTelefone.valueChanges.pipe(
    debounceTime(500)
  ).subscribe({
    next: () => {
      this.emissorDeDadosDeTelefoneDoCliente.emit(this.telefones);
    }
  })

  ngAfterViewInit(): void {
    this.ref.detectChanges();
    this.emissorDeDadosDeTelefoneDoCliente.emit(this.telefones);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let setupTelefonesAtualizacao = changes['setupTelefonesAtualizacao'];
    if (Util.isNotObjectEmpty(setupTelefonesAtualizacao)) {
      if (Util.isNotObjectEmpty(setupTelefonesAtualizacao.currentValue)) {
        this.realizaSetupTelefone(setupTelefonesAtualizacao.currentValue);
      }
    }

    if (this.stepAtual == 1) {
      setTimeout(() => {
        this.inputPrefixo.acionaFoco();
      }, 300);
    }

    if (changes['telefoneEncontradoNoCnpj'] != undefined) {
      let telefones: Telefone[] = changes['telefoneEncontradoNoCnpj'].currentValue;
      if (telefones != undefined) {
        this.atualizaTelefoneComTelefoneEncontradoPeloCnpj(telefones);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.dadosTelefoneSubscribe$ != undefined) this.dadosTelefoneSubscribe$.unsubscribe();
  }

  createFormDadosTelefone(): FormGroup {
    return this.formBuilder.group({
      prefixo: new FormControl(
        {
          value: '',
          disabled: false
        },
        [
          Validators.pattern(this.inputPrefixoPattern)]
      ),
      numero: new FormControl(
        {
          value: '',
          disabled: false
        },
        [
          Validators.minLength(8),
          Validators.maxLength(9)
        ]
      ),
    });
  }

  protected getValueAtributoDadosTelefone(atributo: string): any {
    return this.dadosTelefone.controls[atributo].value;
  }

  protected setValueParaAtributoDadosTelefone(atributo: string, valor: any) {
    this.dadosTelefone.controls[atributo].setValue(valor);
  }

  protected addTelefoneIsValid(): boolean {
    if (this.dadosTelefone.invalid
      || Util.isEmptyString(this.getValueAtributoDadosTelefone('prefixo'))
      || Util.isEmptyString(this.getValueAtributoDadosTelefone('numero'))
      || this.telefones.length == 3) return false;
    else return true;
  }

  protected addTelefone() {
    if (!this.addTelefoneIsValid()) return;

    let telefone: Telefone = {
      prefixo: this.getValueAtributoDadosTelefone('prefixo'),
      numero: this.getValueAtributoDadosTelefone('numero')
    }

    this.telefones.push(telefone);
    this.dadosTelefone.reset();
    this.inputPrefixo.acionaFoco();
  }

  protected recebeEmissaoDeRemocaoDeTelefone(telefone: Telefone) {
    let indexOf:number = this.telefones.indexOf(telefone);
    this.telefones.splice(indexOf, 1);
  }

  private atualizaTelefoneComTelefoneEncontradoPeloCnpj(telefones: Telefone[]) {
    this.telefones = telefones;
    this.emissorDeDadosDeTelefoneDoCliente.emit(this.telefones);
  }

  verificaSePrefixoTelefoneNuloOuVazio(): boolean {
    if (this.getValueAtributoDadosTelefone('prefixo') != '') return true;
    return false;
  }

  verificaSeTipoTelefoneNuloOuVazio(): boolean {
    if (this.getValueAtributoDadosTelefone('tipoTelefone') != '') return true;
    return false;
  }

  realizaTratamentoPrefixo() {
    this.setValueParaAtributoDadosTelefone('prefixo', this.getValueAtributoDadosTelefone('prefixo')
      .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
      .replace(/[^0-9.]/g, '')
      .trim());
  }

  realizaTratamentoNumeroTelefone() {
    this.setValueParaAtributoDadosTelefone('numero', this.getValueAtributoDadosTelefone('numero')
      .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
      .replace(/[^0-9.]/g, '')
      .trim());
  }

  protected avancaProximaEtapa() {
    if (this.dadosTelefone.invalid) {
      this.dadosTelefone.markAllAsTouched();
      this._snackBar.open('Ops! Algum campo está incorreto. Revise o formulário e tente novamente.', "Fechar", {
        duration: 3500
      })
    }
    else {
      if (Util.isNotEmptyString(this.getValueAtributoDadosTelefone('prefixo')) 
      && Util.isNotEmptyString(this.getValueAtributoDadosTelefone('numero'))
      && this.dadosTelefone.valid) {
        this.addTelefone();
      }
    }
  }

  protected realizaSetupTelefone(telefone: Telefone[]) {
    this.telefones = telefone;
    this.emissorDeDadosDeTelefoneDoCliente.emit(this.telefones);
  }

}
