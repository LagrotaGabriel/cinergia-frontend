import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoService } from '../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectBox } from 'src/app/modules/shared/custom-inputs/models/SelectBox';

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

  createFormDadosCliente(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  retornaParaVisualizacaoDePlanos() {
    this.router.navigate(['/assinaturas'])
  }

  geraSelectBoxList(): SelectBox[] {

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
}
