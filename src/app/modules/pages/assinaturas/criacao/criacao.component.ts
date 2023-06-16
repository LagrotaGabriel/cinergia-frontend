import { SelectBox } from './../../../shared/custom-inputs/models/SelectBox';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoService } from '../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectOption } from 'src/app/modules/shared/custom-inputs/models/select-option';
import { Util } from 'src/app/modules/utils/Util';

@Component({
  selector: 'app-criacao',
  templateUrl: './criacao.component.html',
  styleUrls: ['./criacao.component.scss']
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
      periodicidade: ['DIARIO', [Validators.required]]
    });
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

  getHojeUs(): string {
    return Util.getHojeUs();
  }

  recebeAlteracaoDeFormaPagamento(selectBox: SelectBox) {
    this.formaPagamentoAtual = selectBox.value;
  }

}
