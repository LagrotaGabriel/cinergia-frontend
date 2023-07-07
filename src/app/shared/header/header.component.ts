import { EmpresaService } from './../../modules/pages/services/empresa.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideNavDetails } from '../models/SideNavDetails';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmpresaSimplificada } from './models/EmpresaSimplificada';
import { NovaTransferenciaComponent } from './nova-transferencia/nova-transferencia.component';
import { Notificacao } from './models/Notificacao';
import { Subscription, distinctUntilChanged, mergeMap, share, tap, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private empresaService: EmpresaService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private router: Router) { }

  @Output() public enviaAlteracaoEstadoSidebar = new EventEmitter();
  @Input() public sideNavDetails: SideNavDetails;

  public botaoMenuLateralResponsivo: boolean;

  protected empresaSimplificada: EmpresaSimplificada;
  protected notificacoes: Notificacao[] = [];

  private notificacoesEmpresaSubscription$: Subscription;

  ngAfterViewInit(): void {
    this.obtemNomeSaldoEmpresa();
    this.obtemNotificacoesEmpresa();
  }

  alteraExibicaoSideBar() {
    if (this.sideNavDetails.estadoSidebar) {
      this.sideNavDetails.estadoSidebar = false;
    } else {
      this.sideNavDetails.estadoSidebar = true;
    }
    this.enviaAlteracaoEstadoSidebar.emit(this.sideNavDetails.estadoSidebar);
  }

  obtemNomeSaldoEmpresa() {
    this.empresaService.obtemNomeSaldoEmpresa().subscribe({
      next: (response) => {
        this.empresaSimplificada = response;
      }
    })
  }

  obtemNotificacoesEmpresa() {
    this.notificacoesEmpresaSubscription$ = timer(0, 30000).pipe(
      distinctUntilChanged(),
      mergeMap(() => this.empresaService.obtemNotificacoesEmpresa()),
      share(),
    ).subscribe({
      next: (response) => {
        this.notificacoes = response;
      }
    });
  }

  setaNotificacoesComoLidas() {
    this.empresaService.setaNotificacoesComoLidas().subscribe({});
    this.obtemNotificacoesEmpresa();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NovaTransferenciaComponent, {
      width: '35rem',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.matSnackBar.open('Logout realizado com sucesso', 'Fechar', {
      duration: 3500
    })
  }
}
