import { Endereco } from 'src/app/shared/models/Endereco';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from 'src/app/modules/utils/Util';
import { ClienteService } from '../../../services/cliente.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, debounceTime } from 'rxjs';
import { CnpjResponse } from 'src/app/shared/brasil-api/models/cnpj-response';
import { BrasilApiService } from 'src/app/shared/brasil-api/services/brasil-api.service';
import { Telefone } from 'src/app/shared/models/Telefone';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { CustomInputComponent } from 'src/app/modules/shared/custom-inputs/custom-input/custom-input.component';
import { ClienteResponse } from '../../models/ClienteResponse';
import { Mask } from 'src/app/modules/utils/Mask';

@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.component.html',
  styleUrls: ['../criacao.component.scss']
})
export class DadosPessoaisComponent {
  constructor(private formBuilder: FormBuilder,
    private brasilApiService: BrasilApiService,
    private clienteService: ClienteService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef) { }

  // Validations
  inputLengthCpfCnpj: number = 14;
  inputPatternCpfCnpj: any = /^\d{3}.?\d{3}.?\d{3}-?\d{2}/;

  // Tags html
  @ViewChild('inputNome') inputNome: CustomInputComponent;

  // Subscriptions
  validaDuplicidadeCpfCnpjSubscription$: Subscription;
  obtemDadosClientePeloCnpjSubscription$: Subscription;

  @Input() stepAtual: number;
  @Input() setupDadosAtualizacao: ClienteResponse;

  @Output() emissorDeTelefoneEncontradoNoCnpj = new EventEmitter<Telefone[]>();
  @Output() emissorDeEnderecoEncontradoNoCnpj = new EventEmitter<Endereco>();

  protected dadosCliente: FormGroup = this.createFormDadosCliente();
  @Output() emissorDeDadosPessoaisDoCliente = new EventEmitter<FormGroup>();

  dadosColaboradorSubscribe$: Subscription = this.dadosCliente.valueChanges.pipe(
    debounceTime(500)
  ).subscribe({
    next: () => {
      this.emissorDeDadosPessoaisDoCliente.emit(this.dadosCliente);
    }
  })

  ngAfterViewInit(): void {
    this.ref.detectChanges();
    this.emissorDeDadosPessoaisDoCliente.emit(this.dadosCliente);
    this.inputNome.acionaFoco();
  }

  ngOnChanges(changes: SimpleChanges): void {

    let setupDadosAtualizacao = changes['setupDadosAtualizacao'];
    if (Util.isNotObjectEmpty(setupDadosAtualizacao)) {
      if (Util.isNotObjectEmpty(setupDadosAtualizacao.currentValue)) {
        this.realizaSetupDados(setupDadosAtualizacao.currentValue);
      }
    }

    if (Util.isNotObjectEmpty(changes['stepAtual'])) {
      if (this.stepAtual == 0 && !changes['stepAtual'].isFirstChange()) {
        setTimeout(() => {
          this.inputNome.acionaFoco();
        }, 300);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.dadosColaboradorSubscribe$ != undefined) this.dadosColaboradorSubscribe$.unsubscribe();
    if (this.validaDuplicidadeCpfCnpjSubscription$ != undefined) this.validaDuplicidadeCpfCnpjSubscription$.unsubscribe();
    if (this.obtemDadosClientePeloCnpjSubscription$ != undefined) this.obtemDadosClientePeloCnpjSubscription$.unsubscribe();
  }

  createFormDadosCliente(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(50)]],
      tipoPessoa: ['FISICA', Validators.required],
      cpfCnpj: ['', [
        Validators.pattern(this.inputPatternCpfCnpj),
        Validators.maxLength(this.inputLengthCpfCnpj),
        Validators.minLength(this.inputLengthCpfCnpj),
        Validators.required]],
      email: ['', [Validators.email, Validators.maxLength(50)]],
      senha: [''],
      dataNascimento: ['', [this.realizaTratamentoDataNascimento()]],
      statusCliente: ['COMUM', Validators.required],
      observacao: ['']
    });
  }

  protected getValueAtributoDadosCliente(atributo: string): any {
    if (Util.isObjectEmpty(this.dadosCliente)) return null;
    return this.dadosCliente.controls[atributo].value;
  }

  protected setValueParaAtributoDadosCliente(atributo: string, valor: any) {
    this.dadosCliente.controls[atributo].setValue(valor);
  }

  // Geradores de Select Options
  protected geraOptionsTipoPessoa(): SelectOption[] {
    let options: SelectOption[] = [
      {
        text: 'Física',
        value: 'FISICA'
      },
      {
        text: 'Jurídica',
        value: 'JURIDICA'
      }
    ]
    return options;
  }

  protected geraOptionsStatusCliente(): SelectOption[] {
    let options: SelectOption[] = [
      {
        text: 'Comum',
        value: 'COMUM'
      },
      {
        text: 'Devedor',
        value: 'DEVEDOR'
      },
      {
        text: 'Vip',
        value: 'VIP'
      },
      {
        text: 'Atenção',
        value: 'ATENCAO'
      }
    ]
    return options;
  }

  atualizaTipoPessoa() {

    if (this.getValueAtributoDadosCliente('tipoPessoa') == 'FISICA') {
      this.inputLengthCpfCnpj = 14;
      this.inputPatternCpfCnpj = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
      this.dadosCliente.controls['dataNascimento'].enable();
    }
    else if (this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA') {
      this.inputLengthCpfCnpj = 18;
      this.inputPatternCpfCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
      this.dadosCliente.controls['dataNascimento'].disable();
    }
    this.dadosCliente.controls['cpfCnpj'].setValidators([Validators.maxLength(this.inputLengthCpfCnpj),
    Validators.minLength(this.inputLengthCpfCnpj), Validators.pattern(this.inputPatternCpfCnpj)]);

    this.setValueParaAtributoDadosCliente('dataNascimento', '')
    this.setValueParaAtributoDadosCliente('cpfCnpj', '')
  }

  realizaTratamentoCpfCnpj(tecla) {

    if (this.getValueAtributoDadosCliente('tipoPessoa') == 'FISICA' && tecla?.inputType != 'deleteContentBackward'
      || this.getValueAtributoDadosCliente('tipoPessoa') == 'FISICA' && tecla == null) {
      this.setValueParaAtributoDadosCliente('cpfCnpj', Mask.cpfMask(this.getValueAtributoDadosCliente('cpfCnpj')));
    }
    else if (this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA' && tecla?.inputType != 'deleteContentBackward'
      || this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA' && tecla == null) {
      this.setValueParaAtributoDadosCliente('cpfCnpj', Mask.cnpjMask(this.getValueAtributoDadosCliente('cpfCnpj')));
    }
    this.invocaValidacaoDuplicidadeCpfCnpj();
  }

  invocaValidacaoDuplicidadeCpfCnpj() {
    if (
      this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA'
      && this.getValueAtributoDadosCliente('cpfCnpj').length == 18
      && this.dadosCliente.controls['cpfCnpj'].valid ||
      this.getValueAtributoDadosCliente('tipoPessoa') == 'FISICA'
      && this.getValueAtributoDadosCliente('cpfCnpj').length == 14
      && this.dadosCliente.controls['cpfCnpj'].valid) {

      if (this.setupDadosAtualizacao != null) {
        if (this.setupDadosAtualizacao.cpfCnpj == this.getValueAtributoDadosCliente('cpfCnpj')) return;
      }

      this.validaDuplicidadeCpfCnpjSubscription$ = this.clienteService.validaDuplicidadeCpfCnpj(this.getValueAtributoDadosCliente('cpfCnpj')).subscribe({
        error: (error) => {
          this.setValueParaAtributoDadosCliente('cpfCnpj', '');
          this.dadosCliente.controls['cpfCnpj'].reset();
          this._snackBar.open(error, "Fechar", {
            duration: 3500
          });
        },
        complete: () => {
          if (this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA') this.obtemDadosDoClientePeloCnpj();
          console.log('Validação de duplicidade de Cpf/Cnpj finalizada com sucesso')
        }
      });

    }

  }

  obtemDadosDoClientePeloCnpj() {
    let cnpjRequest = this.getValueAtributoDadosCliente('cpfCnpj').replace('-', '').replace('/', '').replace('.', '')
    this.obtemDadosClientePeloCnpjSubscription$ = this.brasilApiService.obtemDadosClientePeloCnpj(cnpjRequest).subscribe({
      next: retornoApi => this.setaClienteComInformacoesObtidasPeloCnpj(retornoApi),
      error: error => {
        this._snackBar.open('Ocorreu um erro na obtenção das informações do CNPJ', "Fechar", {
          duration: 3500
        })
      },
      complete: () => {
        console.log('Informações do CNPJ digitado obtidas com sucesso');
        this._snackBar.open('Informações do CNPJ obtidas', "Fechar", {
          duration: 3500
        });
      }
    })
  }

  setaClienteComInformacoesObtidasPeloCnpj(cnpjResponse: CnpjResponse) {
    this.setaClienteComInformacoesPessoaisObtidasPeloCnpj(cnpjResponse);
    this.setaClienteComInformacoesDeTelefoneObtidasPeloCnpj(cnpjResponse);
    this.setaClienteComInformacoesDeEnderecoObtidasPeloCnpj(cnpjResponse);
  }

  private setaClienteComInformacoesPessoaisObtidasPeloCnpj(cnpjResponse: CnpjResponse) {
    if (Util.isNotEmptyString(cnpjResponse.nomeFantasia)) {
      this.setValueParaAtributoDadosCliente('nome', cnpjResponse.nomeFantasia.slice(0, 50));
      this.dadosCliente.controls['nome'].markAsTouched();
    }
    else if (Util.isNotEmptyString(cnpjResponse.razaoSocial)) {
      this.setValueParaAtributoDadosCliente('nome', cnpjResponse.razaoSocial.slice(0, 50));
      this.dadosCliente.controls['nome'].markAsTouched();
    }

    if (Util.isNotEmptyString(cnpjResponse.email)) {
      this.setValueParaAtributoDadosCliente('email', cnpjResponse.email);
      this.dadosCliente.controls['email'].markAsTouched();
    }
  }

  private setaClienteComInformacoesDeTelefoneObtidasPeloCnpj(cnpjResponse: CnpjResponse) {
    if (Util.isNotEmptyString(cnpjResponse.telefonePrincipal)) {
      let telefones: Telefone[] = [];
      telefones.push({
        prefixo: cnpjResponse.telefonePrincipal.slice(0, 2),
        numero: cnpjResponse.telefonePrincipal.slice(2)
      });

      this.emissorDeTelefoneEncontradoNoCnpj.emit(telefones);
    }
  }

  private setaClienteComInformacoesDeEnderecoObtidasPeloCnpj(cnpjResponse: CnpjResponse) {
    let endereco: Endereco = {
      logradouro: (Util.isNotEmptyString(cnpjResponse.logradouro)) ? cnpjResponse.logradouro : null,
      numero: (Util.isNotEmptyString(cnpjResponse.numero)) ? Util.transformStringToNumber(cnpjResponse.numero) : null,
      bairro: (Util.isNotEmptyString(cnpjResponse.bairro)) ? cnpjResponse.bairro : null,
      cidade: (Util.isNotEmptyString(cnpjResponse.municipio)) ? cnpjResponse.municipio : null,
      codigoPostal: (Util.isNotEmptyNumber(cnpjResponse.cep)) ? cnpjResponse.cep.toString() : null,
      estado: (Util.isNotEmptyString(cnpjResponse.uf)) ? cnpjResponse.uf : null,
      complemento: (Util.isNotEmptyString(cnpjResponse.complemento)) ? cnpjResponse.complemento : null,
    };
    this.emissorDeEnderecoEncontradoNoCnpj.emit(endereco);
  }

  realizaTratamentoDataNascimento(): ValidatorFn {

    return (formGroup: AbstractControl): ValidationErrors | null => {

      if (this.getValueAtributoDadosCliente('dataNascimento') == null)
        return null;

      if (Util.isEmptyString(this.getValueAtributoDadosCliente('dataNascimento'))) {
        this.dadosCliente.controls['dataNascimento'].setValidators([]);
        this.dadosCliente.controls['dataNascimento'].updateValueAndValidity();
        return null;
      }

      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);

      let minDate: Date = new Date();
      minDate.setFullYear(1900);

      let splittedDataInput: any[] = this.getValueAtributoDadosCliente('dataNascimento').split('-');
      let dataNascimentoInput = new Date(splittedDataInput[0], splittedDataInput[1] - 1, splittedDataInput[2]);

      if (dataNascimentoInput > today
        || dataNascimentoInput.getFullYear() < minDate.getFullYear()
        || dataNascimentoInput.toString() == 'Invalid Date') {
        return { nameWrong: true };
      }

      return null;
    }
  }

  atualizaValidatorDataInicio() {
    this.dadosCliente.controls['dataNascimento'].setValidators(this.realizaTratamentoDataNascimento());
    this.dadosCliente.controls['dataNascimento'].updateValueAndValidity();
  }

  realizaSetupDados(cliente: ClienteResponse) {
    this.dadosCliente.setValue({
      nome: cliente.nome,
      tipoPessoa: cliente.tipoPessoa,
      cpfCnpj: cliente.cpfCnpj,
      observacao: cliente.observacoes,
      email: cliente.email,
      senha: cliente.acessoSistema != null ? cliente.acessoSistema.senha : null,
      dataNascimento: cliente.dataNascimento,
      statusCliente: cliente.statusCliente
    })
    this.atualizaValidatorsTipoPessoaSetupAtualizacao();
  }

  atualizaValidatorsTipoPessoaSetupAtualizacao() {
    if (this.getValueAtributoDadosCliente('tipoPessoa') == 'FISICA') {
      this.inputLengthCpfCnpj = 14;
      this.inputPatternCpfCnpj = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
      this.dadosCliente.controls['dataNascimento'].enable();
    }
    else if (this.getValueAtributoDadosCliente('tipoPessoa') == 'JURIDICA') {
      this.inputLengthCpfCnpj = 18;
      this.inputPatternCpfCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
      this.dadosCliente.controls['dataNascimento'].disable();
    }
    this.dadosCliente.controls['cpfCnpj'].setValidators([Validators.maxLength(this.inputLengthCpfCnpj),
    Validators.minLength(this.inputLengthCpfCnpj), Validators.pattern(this.inputPatternCpfCnpj)]);

    this.dadosCliente.controls['cpfCnpj'].updateValueAndValidity();
  }

  retornaParaVisualizacaoDeClientes() {
    this.router.navigate(['/clientes'])
  }

  protected avancaProximaEtapa() {
    if (this.dadosCliente.invalid) {
      this.dadosCliente.markAllAsTouched();
      this._snackBar.open('Ops! Algum campo está incorreto. Revise o formulário e tente novamente.', "Fechar", {
        duration: 3500
      })
    }
  }
}
