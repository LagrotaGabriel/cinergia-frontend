import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TableTd } from 'src/app/modules/shared/models/TableTd';
import { TableTh } from 'src/app/modules/shared/models/TableTh';
import { fadeInOutAnimation } from 'src/app/shared/animations';
import { PlanoResponse } from '../models/PlanoResponse';
import { PlanoPageObject } from '../models/PlanoPageObject';
import { PlanoService } from '../../services/plano.service';

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss'],
  animations: [fadeInOutAnimation]
})
export class VisualizacaoComponent {
  getPlanos$: Subscription;
  removePlano$: Subscription;
  removePlanosEmMassa$: Subscription;
  geraRelatorio$: Subscription;

  buscaPlanos: FormControl = new FormControl();

  planosSelecionadosNaTabela: PlanoResponse[] = JSON.parse(localStorage.getItem("itensSelecionadosNaTabela") || '[]');
  planoPageObject: PlanoPageObject = JSON.parse(localStorage.getItem("pageable") || 'null');

  botaoCheckAllHabilitado: boolean = JSON.parse(localStorage.getItem("checkAll") || 'false');

  constructor(private planoService: PlanoService, private _snackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
    if (this.planoPageObject != null && this.planoPageObject != undefined) this.planoPageObject.pageNumber = 0;

  }

  ngOnDestroy(): void {
    if (this.getPlanos$ != undefined) this.getPlanos$.unsubscribe();
    if (this.removePlano$ != undefined) this.removePlano$.unsubscribe();
    if (this.geraRelatorio$ != undefined) this.geraRelatorio$.unsubscribe();
  }

  invocaRequisicaoHttpGetParaAtualizarObjetos() {
    let buscaPlanosParam = this.buscaPlanos.value != null && this.buscaPlanos.value != '' ? this.buscaPlanos.value : null;
    this.getPlanos$ = this.planoService.getPlanos(buscaPlanosParam, this.planoPageObject).subscribe(
      {
        next: (response: PlanoPageObject) => {
          let sortDirection = this.planoPageObject == null ? this.planoPageObject = undefined : this.planoPageObject.sortDirection;
          this.planoPageObject = response;
          this.planoPageObject.sortDirection = sortDirection;
          if (this.planoPageObject.sortDirection == undefined) this.planoPageObject.sortDirection = 'DESC';
        },
        error: () => {
          this.planoPageObject = null;
        },
        complete: () => {
          this.checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados();
        }
      });
  }

  checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados() {
    this.planosSelecionadosNaTabela.forEach(planoSelecionado => {
      let index: number = this.planoPageObject.content.findIndex(planoEncontrado => planoEncontrado.id === planoSelecionado.id);
      if (index != -1) this.planoPageObject.content[index].checked = true;
    })
  }

  obtemThsTabela(): TableTh[] {
    let thsTabela: TableTh[] = []
    thsTabela.push(
      {
        campo: 'Nome',
        hidden: null
      },
      {
        campo: 'CPF/CNPJ',
        hidden: null
      },
      {
        campo: 'Telefone',
        hidden: null
      },
      {
        campo: 'E-mail',
        hidden: null
      });

    return thsTabela;
  }

  obtemTdsTabela(): TableTd[] {
    let tdsTabela: TableTd[] = []
    tdsTabela.push(
      {
        campo: 'nome',
        hidden: null,
        maxLength: 18
      },
      {
        campo: 'cpfCnpj',
        hidden: null,
        maxLength: 14
      },
      {
        campo: 'telefones',
        hidden: null,
        maxLength: 15
      },
      {
        campo: 'email',
        hidden: null,
        maxLength: 18
      });

    return tdsTabela;
  }

  recebeSolicitacaoDeAtualizacaoDaTabela() {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeBuscaFormControl(busca: FormControl) {
    this.buscaPlanos = busca;
  }

  recebeQtdItensPorPaginaAlterada(pageSize: number) {
    this.planoPageObject.pageNumber = 0;
    this.planoPageObject.pageSize = pageSize;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeObjetoPageableInfoAtualizadoPosTypeAhead(pageableObject: any) {
    this.planoPageObject = pageableObject;
  }

  recebeAtualizacaoNosChecksDaTabela(itensSelecionados: any[]) {
    this.planosSelecionadosNaTabela = itensSelecionados;
  }

  recebePageNumberAtualizado(paginaAtualizada: number) {
    this.planoPageObject.pageNumber = paginaAtualizada;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeSolicitacaoDeRelatorio(ids: number[]) {
    this.geraRelatorio$ = this.planoService.obtemRelatorioPlanos(ids);
  }
}