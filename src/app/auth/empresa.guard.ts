import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpresaService } from '../modules/pages/services/empresa.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaGuard implements CanActivate {

  constructor(private empresaService: EmpresaService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    let authenticated = this.empresaService.isAuthenticated();
    if (authenticated) return true;
    else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
