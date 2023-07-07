import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableTd } from 'src/app/modules/shared/models/TableTd';
import { TableTh } from 'src/app/modules/shared/models/TableTh';
import { PagamentoResponse } from '../../assinaturas/models/pagamentos/PagamentoResponse';
import { PagamentoPageObject } from '../../assinaturas/models/pagamentos/PagamentoPageObject';
import { PagamentoService } from '../../services/pagamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInOutAnimation } from 'src/app/shared/animations';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss'],
  animations: [fadeInOutAnimation]
})
export class VisualizacaoComponent {
  getPagamentos$: Subscription;
  geraRelatorio$: Subscription;
  removePagamento$: Subscription;

  buscaPagamentos: FormControl = new FormControl();

  pagamentosSelecionadosNaTabela: PagamentoResponse[] = JSON.parse(localStorage.getItem("itensSelecionadosNaTabela") || '[]');
  pagamentoPageObject: PagamentoPageObject = JSON.parse(localStorage.getItem("pageable") || 'null');

  botaoCheckAllHabilitado: boolean = JSON.parse(localStorage.getItem("checkAll") || 'false');

  constructor(private pagamentoService: PagamentoService, private _snackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
    if (this.pagamentoPageObject != null && this.pagamentoPageObject != undefined) this.pagamentoPageObject.pageNumber = 0;

  }

  ngOnDestroy(): void {
    if (this.getPagamentos$ != undefined) this.getPagamentos$.unsubscribe();
    if (this.geraRelatorio$ != undefined) this.geraRelatorio$.unsubscribe();
    if (this.removePagamento$ != undefined) this.removePagamento$.unsubscribe();
  }

  invocaRequisicaoHttpGetParaAtualizarObjetos() {
    let buscaPlanosParam = this.buscaPagamentos.value != null && this.buscaPagamentos.value != '' ? this.buscaPagamentos.value : null;
    this.getPagamentos$ = this.pagamentoService.getPagamentos(buscaPlanosParam, this.pagamentoPageObject).subscribe(
      {
        next: (response: PagamentoPageObject) => {
          let sortDirection = this.pagamentoPageObject == null ? this.pagamentoPageObject = undefined : this.pagamentoPageObject.sortDirection;
          response.content.forEach(objeto => {
            objeto.options = {
              detalhesHabilitado: true,
              editarHabilitado: false,
              removerHabilitado: true,
              geraBoletoPagamento: (objeto.formaPagamento == 'Boleto') ? true : false,
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
        },
        complete: () => {
          this.checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados();
        }
      });
  }

  checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados() {
    this.pagamentosSelecionadosNaTabela.forEach(pagamentoSelecionado => {
      let index: number = this.pagamentoPageObject.content.findIndex(pagamentoEncontrado => pagamentoEncontrado.id === pagamentoSelecionado.id);
      if (index != -1) this.pagamentoPageObject.content[index].checked = true;
    })
  }

  obtemThsTabela(): TableTh[] {
    let thsTabela: TableTh[] = []
    thsTabela.push(
      {
        campo: 'Descrição',
        hidden: null
      },
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
        campo: 'descricao',
        hidden: null,
        maxLength: 30,
        type: 'string',
        titleCase: true,
        tableTdCustomClasses: [],
      },
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

  recebeSolicitacaoDeAtualizacaoDaTabela() {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeBuscaFormControl(busca: FormControl) {
    this.buscaPagamentos = busca;
  }

  recebeQtdItensPorPaginaAlterada(pageSize: number) {
    this.pagamentoPageObject.pageNumber = 0;
    this.pagamentoPageObject.pageSize = pageSize;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeObjetoPageableInfoAtualizadoPosTypeAhead(pageableObject: any) {
    this.pagamentoPageObject = pageableObject;
  }

  recebeAtualizacaoNosChecksDaTabela(itensSelecionados: any[]) {
    this.pagamentosSelecionadosNaTabela = itensSelecionados;
  }

  recebePageNumberAtualizado(paginaAtualizada: number) {
    this.pagamentoPageObject.pageNumber = paginaAtualizada;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeSolicitacaoDeRelatorio(ids: number[]) {
    this.geraRelatorio$ = this.pagamentoService.obtemRelatorioPagamentos(ids);
  }

  recebeSolicitacaoDeExclusao(id: number) {
    this.removePagamento$ = this.pagamentoService.removePagamento(id).subscribe({
      error: (httpErrorResponse: HttpErrorResponse) => {
        this._snackBar.open(httpErrorResponse.error?.error, 'Fechar', {
          duration: 5000
        })
      },
      complete: () => {
        this.invocaRequisicaoHttpGetParaAtualizarObjetos();
        this._snackBar.open("Pagamento removido com sucesso", "Fechar", {
          duration: 5000
        })
      }
    });
  }
}
