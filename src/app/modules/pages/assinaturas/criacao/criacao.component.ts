import { SelectBox } from './../../../shared/custom-inputs/models/SelectBox';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoService } from '../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { Util } from 'src/app/modules/utils/Util';
import { slideUpDownAnimation } from 'src/app/shared/animations';
import { PlanoRequest } from '../models/PlanoRequest';
import { ClienteService } from '../../services/cliente.service';
import { ClienteResponse } from '../../clientes/models/ClienteResponse';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-criacao',
  templateUrl: './criacao.component.html',
  styleUrls: ['./criacao.component.scss'],
  animations: [slideUpDownAnimation]
})
export class CriacaoComponent {
  constructor(private formBuilder: FormBuilder,
    private planoService: PlanoService,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef) { }

  titulo: string = 'Cadastrar nova assinatura';
  protected dadosPlano: FormGroup = this.createFormDadosCliente();

  protected formaPagamentoAtual: string = 'BOLETO';
  protected notificacoes: string[] = [];

  private cliente: ClienteResponse;
  private obtemClienteSubscription$: Subscription;

  ngAfterViewInit(): void {

    console.log(Util.getHojeUs());

    this.obtemClienteSubscription$ = this.clienteService.obtemClientePorId(parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
      next: (response: ClienteResponse) => {
        this.cliente = response;
        this.setValueParaAtributoDadosPlano('cliente', this.cliente.nome);
      }
    })
  }
  
  ngOnDestroy(): void {
    if (Util.isNotObjectEmpty(this.obtemClienteSubscription$)) this.obtemClienteSubscription$.unsubscribe();
  }

  createFormDadosCliente(): FormGroup {
    return this.formBuilder.group({
      cliente: [''],
      descricao: ['', [Validators.required, Validators.maxLength(50)]],
      valor: ['0,00', [Validators.required]],
      dataInicio: [Util.getHojeUs()],
      periodicidade: ['MENSAL', [Validators.required]],
    });
  }

  protected getValueAtributoDadosPlano(atributo: string): any {
    return this.dadosPlano.controls[atributo].value;
  }

  protected setValueParaAtributoDadosPlano(atributo: string, valor: any) {
    this.dadosPlano.controls[atributo].setValue(valor);
  }

  retornaParaVisualizacaoDePlanos() {
    this.router.navigate(['/assinaturas'])
  }

  geraSelectBoxListFormasDePagamento(): SelectBox[] {

    let selectBoxList: SelectBox[];

    selectBoxList = [
      {
        text: 'Boleto',
        value: 'BOLETO',
        icon: 'receipt',
        placeholder: 'Taxa de R$ 3,49 por transação paga'
      },
      {
        text: 'Pix',
        value: 'PIX',
        icon: 'qr_code_2',
        placeholder: 'Taxa de R$ 3,49 por transação paga'
      },
      {
        text: 'Crédito',
        value: 'CREDIT_CARD',
        icon: 'credit_card',
        placeholder: 'Taxa de R$ 1,99 + 2,99% por transação paga'
      },
      // {
      //   text: 'Débito',
      //   value: 'DEBIT_CARD',
      //   icon: 'account_balance'
      // }
    ]

    return selectBoxList;
  }

  geraSelectBoxListNotificacoesCobranca(): SelectBox[] {
    let selectBoxList: SelectBox[];

    selectBoxList = [
      {
        text: 'Whatsapp',
        value: 'WHATSAPP',
        icon: 'call',
        placeholder: 'Permite que o cliente seja notificado através do número de whatsapp cadastrado'
      },
      {
        text: 'E-mail',
        value: 'EMAIL',
        icon: 'mail',
        placeholder: 'Permite que o cliente seja notificado através do e-mail cadastrado'
      },
      {
        text: 'Sistema',
        value: 'SISTEMA',
        icon: 'computer',
        placeholder: 'Permite que o cliente seja notificado através do seu login no sistema'
      },
    ]

    return selectBoxList;
  }

  geraOptionsPeriodicidadeCobranca(): SelectOption[] {

    let options: SelectOption[];

    options = [
      {
        text: 'Semanal',
        value: 'SEMANAL'
      },
      {
        text: 'Mensal',
        value: 'MENSAL'
      },
      {
        text: 'Semestral',
        value: 'SEMESTRAL'
      },
      {
        text: 'Anual',
        value: 'ANUAL'
      }
    ]

    return options;
  }

  realizaTratamentoCpfCnpj() {
    this.setValueParaAtributoDadosPlano('cpfCnpjPortador', this.getValueAtributoDadosPlano('cpfCnpjPortador')
      .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
      .replace(/[^0-9.]/g, '')
      .trim());
  }

  realizaTratamentoNumeroCartao() {
    this.setValueParaAtributoDadosPlano('numero', this.getValueAtributoDadosPlano('numero')
      .replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}-]/g, "")
      .replace(/[^0-9.]/g, '')
      .trim());
  }

  getHojeUs(): string {
    return Util.getHojeUs();
  }

  recebeAlteracaoDeFormaPagamento(selectBox: SelectBox) {
    this.formaPagamentoAtual = selectBox.value;
  }

  recebeAlteracaoDeNotificacoes(selectBoxes: SelectBox[]) {
    let notificacoes: string[] = [];
    selectBoxes.forEach(box => {
      notificacoes.push(box.value);
    })
    this.notificacoes = notificacoes;
  }

  realizaCriacaoDeObjetoPlano(): PlanoRequest {
    let planoRequest: PlanoRequest = {
      id: null,
      dataInicio: this.getValueAtributoDadosPlano('dataInicio'),
      descricao: this.getValueAtributoDadosPlano('descricao'),
      valor: this.getValueAtributoDadosPlano('valor'),
      formaPagamento: this.formaPagamentoAtual,
      periodicidade: this.getValueAtributoDadosPlano('periodicidade'),
      notificacoes: this.notificacoes
    }
    return planoRequest;
  }

  realizaAcionamentoDoMetodoDeCriacaoDeObjetoPlano() {
    this.planoService.novoPlano(this.realizaCriacaoDeObjetoPlano(), parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: () => {

      },
      complete: () => {

      }
    })
  }

}
