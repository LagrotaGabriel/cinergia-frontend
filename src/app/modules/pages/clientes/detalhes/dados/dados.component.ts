import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteResponse } from '../../models/ClienteResponse';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/modules/utils/Util';
import { slideUpDownAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss'],
  animations: [slideUpDownAnimation]
})
export class DadosComponent {
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar) {
  }

  private idCliente: number;
  @Input() cliente: ClienteResponse;

  dadosAcesso: boolean = false;

  urlImagemPerfil;

  protected obtemDetalhesDoClientePorIdSubscription$: Subscription;
  protected removeClenteSubscription$: Subscription;
  protected obtemImagemPerfilClienteSubscription$: Subscription;
  protected atualizaImagemPerfilClienteSubscription$: Subscription;

  ngAfterViewInit(): void {
    this.ref.detectChanges();
    this.realizaValidacaoDoIdCliente();
    this.realizaObtencaoDeDadosDoCliente();
  }

  ngOnDestroy(): void {
    if (Util.isNotObjectEmpty(this.obtemDetalhesDoClientePorIdSubscription$)) this.obtemDetalhesDoClientePorIdSubscription$.unsubscribe();
    if (Util.isNotObjectEmpty(this.removeClenteSubscription$)) this.removeClenteSubscription$.unsubscribe();
    if (Util.isNotObjectEmpty(this.obtemImagemPerfilClienteSubscription$)) this.obtemImagemPerfilClienteSubscription$.unsubscribe();
    if (Util.isNotObjectEmpty(this.atualizaImagemPerfilClienteSubscription$)) this.atualizaImagemPerfilClienteSubscription$.unsubscribe();
  }

  realizaValidacaoDoIdCliente() {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if (/^\d+$/.test(id)) this.idCliente = parseInt(id);
    else {
      this.router.navigate(['/clientes']);
      this._snackBar.open("O cliente que você tentou acessar não existe", "Fechar", {
        duration: 3500
      });
    }
  }

  realizaObtencaoDeDadosDoCliente() {
    this.obtemDetalhesDoClientePorIdSubscription$ = this.clienteService.obtemDetalhesDoClientePorId(this.idCliente).subscribe({
      next: (resposta => {
        this.cliente = resposta;
        this.obtemSrcImagem(resposta);
      }),
      error: () => {
        this.router.navigate(['/clientes']);
        this._snackBar.open("O cliente que você tentou acessar não existe", "Fechar", {
          duration: 3500
        });
      }
    })
  }

  retornarParaTabela() {
    this.router.navigate(['/clientes'])
  }

  redirecionaParaEdicaoCliente() {
    this.router.navigate(
      ['/clientes/update'],
      { queryParams: { id: this.cliente.id } }
    );
  }

  invocaMetodoExclusaoCliente() {
    this.removeClenteSubscription$ = this.clienteService.removeCliente(this.cliente.id).subscribe({
      complete: () => {
        this.router.navigate(['/clientes']);
        this._snackBar.open('Cliente removido com sucesso', 'Fechar', {
          duration: 3500
        })
      }
    })
  }

  obtemSrcImagem(cliente: ClienteResponse) {
    console.log(cliente?.fotoPerfil);
    if (Util.isObjectEmpty(cliente?.fotoPerfil)) this.urlImagemPerfil = '/assets/imgs/profile_photo.png';
    else {
      this.obtemImagemPerfilClienteSubscription$ = this.clienteService.obtemImagemPerfilCliente(cliente.id).subscribe({
        next: (resposta) => {
          const reader = new FileReader();
          reader.onload = (e) => this.urlImagemPerfil = e.target.result;
          reader.readAsDataURL(new Blob([resposta]));
        },
        error: () => {
          this.urlImagemPerfil = '/assets/imgs/profile_photo.png';
        }
      });

    }
  }

  estiloStatusCliente(statusCliente: string): string {
    switch (statusCliente) {
      case ('COMUM'): return 'status_blue';
      case ('DEVEDOR'): return 'status_red';
      case ('VIP'): return 'status_purple';
      case ('ATENCAO'): return 'status_yellow';
      default: return null;
    }
  }

  realizaChamadaServicoDeAtualizacaoDeImagemDePerfilDoCliente(event) {

    let fotoPerfil: File;

    if (this.cliente.fotoPerfil != null) {
      if (window.confirm('Tem certeza que deseja substituir a imagem de perfil atual?')) null;
      else return;
    }

    if (event.target.files[0] == undefined) return;

    else {
      const max_size = 10048576;
      const allowed_types = ['image/png', 'image/jpeg'];

      if (event.target.files[0].size > max_size) {
        this._snackBar.open("O tamanho da imagem não pode ser maior do que 10MB", "Fechar", {
          duration: 5000
        })
        return;
      }
      else if (!(allowed_types.includes(event.target.files[0].type))) {
        this._snackBar.open("Tipo de arquivo inválido. Escolha uma imagem de extensão .jpg ou .png", "Fechar", {
          duration: 5000
        })
        return;
      }
      else {
        fotoPerfil = event.target.files[0];
        this.atualizaImagemPerfilClienteSubscription$ = this.clienteService.atualizaImagemPerfilCliente(this.cliente.id, fotoPerfil).subscribe({
          next: (response: ClienteResponse) => {
            console.log(response);
            this.cliente = response;
            this.obtemSrcImagem(response);
          },
          complete: () => {
            this._snackBar.open('Imagem de perfil atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
          }
        })

      }

    }
  }

  realizaChamadaServicoDeExclusaoDeImagemDePerfilDoCliente() {
    this.atualizaImagemPerfilClienteSubscription$ = this.clienteService.atualizaImagemPerfilCliente(this.cliente.id, null).subscribe({
      next: (response: ClienteResponse) => {
        this.cliente = response;
      },
      complete: () => {
        this.urlImagemPerfil = '/assets/imgs/profile_photo.png'
        this._snackBar.open('Imagem de perfil removida com sucesso!', 'Fechar', {
          duration: 3000
        });
      }
    })
  }
}
