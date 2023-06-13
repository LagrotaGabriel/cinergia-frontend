import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TableTd } from '../models/TableTd';
import { TableTh } from '../models/TableTh';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent {

  constructor(private router: Router) { }

  @Input() theads: TableTh[];
  @Input() tbodies: TableTd[];
  @Input() objetos: any[];
  @Input() modulo: string;

  botaoCheckAllHabilitado: boolean = JSON.parse(localStorage.getItem("checkAll") || 'false');
  itensSelecionadosNaTabela: any[] = JSON.parse(localStorage.getItem("itensSelecionadosNaTabela") || '[]');

  @Output() emiteAlteracaoDoEstadoDeCheckDaTabela = new EventEmitter<any>();
  @Output() emiteSolicitacaoDeExclusaoDoItem = new EventEmitter<number>();

  ngAfterViewInit(): void {
    console.log(this.objetos);
  }

  ngDoCheck(): void {
    localStorage.setItem('itensSelecionadosNaTabela', JSON.stringify(this.itensSelecionadosNaTabela));
    this.ajustaCheckDeObjetosNaTabelaComBaseNoCheckAll();
  }

  obtemTd(objeto: any, tbody: TableTd): TableTd {
    let valorCampo = objeto[tbody.campo] || '-';

    if (tbody.campo == 'telefones' && objeto['telefones'].length > 0) {
      console.log(objeto['telefones'])
      valorCampo = '(' + (objeto['telefones'][0].prefixo) + ')' + ' ' + (objeto['telefones'][0].numero);
    }

    let td: TableTd = {
      campo: valorCampo,
      hidden: tbody.hidden,
      maxLength: tbody.maxLength
    };

    return td;
  }

  checkAll() {
    if (!this.botaoCheckAllHabilitado) {
      this.objetos.forEach(itemTabela => {
        if (!itemTabela.checked) {
          itemTabela.checked = true;
          this.itensSelecionadosNaTabela.push(itemTabela);
        }
      })
    }
    else {
      this.objetos.forEach(itemTabela => {
        if (itemTabela.checked) {
          let itemListaTabela: any[] = this.itensSelecionadosNaTabela.filter(item => item.id == itemTabela.id)
          if (itemListaTabela.length == 1) {
            this.itensSelecionadosNaTabela.splice(this.itensSelecionadosNaTabela.indexOf(itemListaTabela[0]), 1);
            itemTabela.checked = false;
          }
        }
      })
    }

    this.botaoCheckAllHabilitado = !this.botaoCheckAllHabilitado;

    localStorage.setItem('checkAll', JSON.stringify(this.botaoCheckAllHabilitado));
  }

  alteraEstadoCheckTabela(indice: number) {
    if (this.objetos[indice].checked) {
      let indiceNaListaDeSelecionados: number =
        this.itensSelecionadosNaTabela.findIndex(clienteSelecionado => clienteSelecionado.id === this.objetos[indice].id);
      this.itensSelecionadosNaTabela =
        this.itensSelecionadosNaTabela.filter((_, item) => item < indiceNaListaDeSelecionados || item >= indiceNaListaDeSelecionados + 1);
    }
    else {
      this.itensSelecionadosNaTabela = this.itensSelecionadosNaTabela.concat(this.objetos[indice]);
    }
    this.objetos[indice].checked = !this.objetos[indice].checked;

    this.ajustaCheckDeObjetosNaTabelaComBaseNoCheckAll();

    this.emiteAlteracaoDoEstadoDeCheckDaTabela.emit(this.itensSelecionadosNaTabela);
  }

  ajustaCheckDeObjetosNaTabelaComBaseNoCheckAll() {
    if (this.verificaSeConteudoMaiorQueZero()) {
      if (this.objetos.filter(e => e.checked === false).length > 0) {
        this.botaoCheckAllHabilitado = false;
      }
      else if (this.objetos.filter(e => e.checked).length == this.objetos.length) {
        this.botaoCheckAllHabilitado = true;
      }
    }
  }

  verificaSeConteudoMaiorQueZero(): boolean {
    if (this.objetos != null) {
      if (this.objetos.length > 0) return true;
    }
    return false;
  }

  excluiItem(id: number) {
    this.emiteSolicitacaoDeExclusaoDoItem.emit(id);
  }

  encaminhaParaAlteracaoItem(id: number) {
    this.router.navigate(
      [this.modulo + '/update'],
      { queryParams: { id: id } }
    );
  }
}
