import { SelectBox } from './../../../shared/custom-inputs/models/SelectBox';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoService } from '../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { Util } from 'src/app/modules/utils/Util';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-criacao',
  templateUrl: './criacao.component.html',
  styleUrls: ['./criacao.component.scss'],
  animations: [slideUpDownAnimation]
})
export class CriacaoComponent {
  constructor(private formBuilder: FormBuilder,
    private planoService: PlanoService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef) { }

  titulo: string = 'Cadastrar nova assinatura';
  protected dadosPlano: FormGroup = this.createFormDadosCliente();

  protected formaPagamentoAtual: string = 'BOLETO';

  createFormDadosCliente(): FormGroup {
    return this.formBuilder.group({
      cliente: ['João da Silva'],
      descricao: ['', [Validators.required, Validators.maxLength(50)]],
      valor: ['0,00', [Validators.required]],
      dataInicio: [Util.getHojeUs()],
      periodicidade: ['DIARIO', [Validators.required]],
      nomePortador: ['João da Silva', Validators.required],
      cpfCnpjPortador: ['122.233.455-66', Validators.required],
      numero: ['', Validators.required],
      ccv: ['', Validators.required],
      vencimento: ['', Validators.required]
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
        icon: 'receipt'
      },
      {
        text: 'Pix',
        value: 'PIX',
        icon: 'qr_code_2'
      },
      {
        text: 'Crédito',
        value: 'CREDIT_CARD',
        icon: 'credit_card'
      },
      {
        text: 'Débito',
        value: 'DEBIT_CARD',
        icon: 'account_balance'
      }
    ]

    return selectBoxList;
  }

  geraSelectBoxListNotificacoesCobranca(): SelectBox[] {
    let selectBoxList: SelectBox[];

    selectBoxList = [
      {
        text: 'Whatsapp',
        value: 'WHATSAPP',
        icon: 'call'
      },
      {
        text: 'E-mail',
        value: 'EMAIL',
        icon: 'mail'
      },
      {
        text: 'Sistema',
        value: 'SISTEMA',
        icon: 'computer'
      },
    ]

    return selectBoxList;
  }

  geraOptionsPeriodicidadeCobranca(): SelectOption[] {

    let options: SelectOption[];

    options = [
      {
        text: 'Diária',
        value: 'DIARIO'
      },
      {
        text: 'Semanal',
        value: 'SEMANAL'
      },
      {
        text: 'Mensal',
        value: 'MENSAL'
      },
      {
        text: 'Trimestral',
        value: 'TRIMESTRAL'
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

}
