import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideNavDetails } from '../models/SideNavDetails';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public dialog: MatDialog, 
    private matSnackBar: MatSnackBar,
    private router: Router) {}

  @Output() public enviaAlteracaoEstadoSidebar = new EventEmitter();
  @Input() public sideNavDetails: SideNavDetails;

  public botaoMenuLateralResponsivo: boolean;

  alteraExibicaoSideBar() {
    if (this.sideNavDetails.estadoSidebar) {
      this.sideNavDetails.estadoSidebar = false;
    } else {
      this.sideNavDetails.estadoSidebar = true;
    }
    this.enviaAlteracaoEstadoSidebar.emit(this.sideNavDetails.estadoSidebar);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.matSnackBar.open('Logout realizado com sucesso', 'Fechar', {
      duration: 3500
    })
  }
}
