import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientePageObject } from '../models/ClientePageObject';
import { ClienteResponse } from '../models/ClienteResponse';
import { Subscription } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss'],
  animations: [fadeInOutAnimation]
})
export class VisualizacaoComponent {

  getClientes$: Subscription;
  removeCliente$: Subscription;
  removeClientesEmMassa$: Subscription;
  geraRelatorio$: Subscription;

  buscaClientes: FormControl = new FormControl();

  clientesSelecionadosNaTabela: ClienteResponse[] = JSON.parse(localStorage.getItem("itensSelecionadosNaTabela") || '[]');
  clientePageObject: ClientePageObject = JSON.parse(localStorage.getItem("pageable") || 'null');

  botaoCheckAllHabilitado: boolean = JSON.parse(localStorage.getItem("checkAll") || 'false');

  constructor(private clienteService: ClienteService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
    if (this.clientePageObject != null && this.clientePageObject != undefined) this.clientePageObject.pageNumber = 0;
  }

  ngOnDestroy(): void {
    if (this.getClientes$ != undefined) this.getClientes$.unsubscribe();
    if (this.removeCliente$ != undefined) this.removeCliente$.unsubscribe();
    if (this.geraRelatorio$ != undefined) this.geraRelatorio$.unsubscribe();
  }

  invocaRequisicaoHttpGetParaAtualizarObjetos() {
    let buscaClientesParam = this.buscaClientes.value != null && this.buscaClientes.value != '' ? this.buscaClientes.value : null;
    this.getClientes$ = this.clienteService.getClientes(buscaClientesParam, this.clientePageObject).subscribe(
      {
        next: (response: ClientePageObject) => {
          let sortDirection = this.clientePageObject == null ? this.clientePageObject = undefined : this.clientePageObject.sortDirection;
          this.clientePageObject = response;
          this.clientePageObject.sortDirection = sortDirection;
          if (this.clientePageObject.sortDirection == undefined) this.clientePageObject.sortDirection = 'DESC';
        },
        error: () => {
          this.clientePageObject = null;
        },
        complete: () => {
          this.checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados();
        }
      });
  }

  checkObjetosQueEstaoNoLocalStorageDeObjetosSelecionados() {
    this.clientesSelecionadosNaTabela.forEach(clienteSelecionado => {
      let index: number = this.clientePageObject.content.findIndex(clienteEncontrado => clienteEncontrado.id === clienteSelecionado.id);
      if (index != -1) this.clientePageObject.content[index].checked = true;
    })
  }

  obtemThsTabela(): string[] {
    let thsTabela: string[] = []
    thsTabela.push('Nome', 'CPF/CNPJ', 'Telefone', 'E-mail');
    return thsTabela;
  }

  obtemTdsTabela(): string[] {
    let tdsTabela: string[] = []
    tdsTabela.push('nome', 'cpfCnpj', 'telefone', 'email');
    return tdsTabela;
  }

  recebeSolicitacaoDeAtualizacaoDaTabela() {
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeBuscaFormControl(busca: FormControl) {
    this.buscaClientes = busca;
  }

  recebeQtdItensPorPaginaAlterada(pageSize: number) {
    this.clientePageObject.pageNumber = 0;
    this.clientePageObject.pageSize = pageSize;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeObjetoPageableInfoAtualizadoPosTypeAhead(pageableObject: any) {
    this.clientePageObject = pageableObject;
  }

  recebeAtualizacaoNosChecksDaTabela(itensSelecionados: any[]) {
    this.clientesSelecionadosNaTabela = itensSelecionados;
  }

  recebePageNumberAtualizado(paginaAtualizada: number) {
    this.clientePageObject.pageNumber = paginaAtualizada;
    this.invocaRequisicaoHttpGetParaAtualizarObjetos();
  }

  recebeSolicitacaoDeExclusao(id: number) {
    this.removeCliente$ = this.clienteService.removeCliente(id).subscribe(
      {
        next: () => {
          this._snackBar.open("Cliente Excluído com sucesso", "Fechar", {
            duration: 3500
          });
        },
        error: () => {
          this.invocaRequisicaoHttpGetParaAtualizarObjetos()
        },
        complete: () => {
          let clienteRemovido: ClienteResponse[] = this.clientesSelecionadosNaTabela.filter(cliente => cliente.id == id);
          if (clienteRemovido.length == 1) this.clientesSelecionadosNaTabela.splice(this.clientesSelecionadosNaTabela.indexOf(clienteRemovido[0]), 1);
          this.invocaRequisicaoHttpGetParaAtualizarObjetos()
        }
      }
    );
  }

  recebeSolicitacaoDeExclusaoDeClientesEmMassa(ids: number[]) {
    this.removeClientesEmMassa$ = this.clienteService.removeClienteEmMassa(ids).subscribe(
      {
        next: () => {
          this._snackBar.open("Clientes Excluídos com sucesso", "Fechar", {
            duration: 3000
          });
        },
        error: () => {
          this.invocaRequisicaoHttpGetParaAtualizarObjetos();
        },
        complete: () => {
          ids.forEach(idSelecionadoNaTabela => {
            let clienteRemovido: ClienteResponse[] = this.clientesSelecionadosNaTabela.filter(cliente => cliente.id == idSelecionadoNaTabela);
            if (clienteRemovido.length == 1) this.clientesSelecionadosNaTabela.splice(this.clientesSelecionadosNaTabela.indexOf(clienteRemovido[0]), 1);
          })
          this.invocaRequisicaoHttpGetParaAtualizarObjetos();
          this._snackBar.open(ids.length > 1
            ? "Clientes removidos com sucesso"
            : "Cliente removido com sucesso", "Fechar", {
            duration: 3500
          })
        }
      }
    );
  }

  recebeSolicitacaoDeRelatorio(ids: number[]) {
    this.geraRelatorio$ = this.clienteService.obtemRelatorioClientes(ids);
  }

}
