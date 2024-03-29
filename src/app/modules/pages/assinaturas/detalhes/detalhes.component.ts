import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TableTd } from 'src/app/modules/shared/models/TableTd';
import { TableTh } from 'src/app/modules/shared/models/TableTh';
import { Util } from 'src/app/modules/utils/Util';
import { PagamentoService } from '../../services/pagamento.service';
import { PagamentoPageObject } from '../models/pagamentos/PagamentoPageObject';
import { PlanoService } from '../../services/plano.service';
import { PlanoResponse } from '../models/PlanoResponse';
import { fadeInOutAnimation } from 'src/app/shared/animations';
import { DadosPlanoResponse } from '../models/DadosPlanoResponse';
import { TableOptions } from 'src/app/modules/shared/models/TableOptions';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
  animations: [fadeInOutAnimation]
})
export class DetalhesComponent {

  constructor(private pagamentoService: PagamentoService,
    private planoService: PlanoService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  getPagamentos$: Subscription;
  obterPlanoAtual$: Subscription;
  obterDadosPlano$: Subscription;
  pagamentoPageObject: PagamentoPageObject = JSON.parse(localStorage.getItem("pageable") || 'null');

  protected plano: PlanoResponse;
  protected dadosPlano: DadosPlanoResponse;

  ngAfterViewInit(): void {
    this.invocaRequisicaoParaObterPlanoAtual();
    this.invocaRequisicaoParaObterDadosPlano();
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
    if (Util.isNotObjectEmpty(this.pagamentoPageObject)) this.pagamentoPageObject.pageNumber = 0;
  }

  ngOnDestroy(): void {
    if (this.getPagamentos$ != undefined) this.getPagamentos$.unsubscribe();
    if (this.obterPlanoAtual$ != undefined) this.obterPlanoAtual$.unsubscribe();
    if (this.obterDadosPlano$ != undefined) this.obterDadosPlano$.unsubscribe();
  }

  obtemThsTabela(): TableTh[] {
    let thsTabela: TableTh[] = []
    thsTabela.push(
      {
        campo: 'Vencimento',
        hidden: null
      },
      {
        campo: 'Data do pgto.',
        hidden: null
      },
      {
        campo: 'Valor',
        hidden: null
      },
      {
        campo: 'Forma de pgto.',
        hidden: null
      },
      {
        campo: 'Status',
        hidden: null
      }
    );

    return thsTabela;
  }

  obtemTdsTabela(): TableTd[] {
    let tdsTabela: TableTd[] = []
    tdsTabela.push(
      {
        campo: 'dataVencimento',
        hidden: null,
        maxLength: 18,
        type: 'date',
        titleCase: false,
        tableTdCustomClasses: [],
      },
      {
        campo: 'dataPagamento',
        hidden: null,
        maxLength: 18,
        type: 'date',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'valorBruto',
        hidden: null,
        maxLength: 14,
        type: 'money',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'formaPagamento',
        hidden: null,
        maxLength: 15,
        type: 'string',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'statusPagamento',
        hidden: null,
        maxLength: 18,
        type: 'string',
        titleCase: false,
        tableTdCustomClasses: [
          {
            value: 'Aprovado',
            className: 'green_span'
          },
          {
            value: 'Reprovado',
            className: 'red_span'
          },
          {
            value: 'Atrasado',
            className: 'red_span'
          },
          {
            value: 'Cancelado',
            className: 'red_span'
          },
          {
            value: 'Pendente',
            className: 'yellow_span'
          },
        ]
      },);

    return tdsTabela;
  }

  invocaRequisicaoParaObterDadosPlano() {
    this.obterPlanoAtual$ = this.planoService.obtemDadosPlanoPorId(parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
      next: (response: DadosPlanoResponse) => {
        this.dadosPlano = response;
      }
    });
  }

  invocaRequisicaoParaObterPlanoAtual() {
    this.obterPlanoAtual$ = this.planoService.obtemPlanoPorId(parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
      next: (response: PlanoResponse) => {
        this.plano = response;
      }
    });
  }

  invocaRequisicaoHttpGetParaAtualizarObjetos() {
    this.getPagamentos$ = this.pagamentoService.getPagamentosPlano(this.pagamentoPageObject, parseInt(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(
      {
        next: (response: PagamentoPageObject) => {
          let sortDirection = this.pagamentoPageObject == null ? this.pagamentoPageObject = undefined : this.pagamentoPageObject.sortDirection;
          response.content.forEach(objeto => {
            objeto.options = {
              detalhesHabilitado: false,
              editarHabilitado: false,
              removerHabilitado: false,
              geraBoletoPagamento: objeto.formaPagamento == 'Boleto' ? true : false,
              geraLinkCobrancaPagamento: objeto.formaPagamento != 'Cartão de crédito' ? true : false,
              geraComprovantePagamento: objeto.statusPagamento == 'Aprovado' ? true : false
            }
          })
          this.pagamentoPageObject = response;
          this.pagamentoPageObject.sortDirection = sortDirection;
          if (this.pagamentoPageObject.sortDirection == undefined) this.pagamentoPageObject.sortDirection = 'DESC';
        },
        error: () => {
          this.pagamentoPageObject = null;
        }
      });
  }

  retornarParaTabela() {
    this.router.navigate(['/assinaturas']);
  }

}
