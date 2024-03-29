import { Observable, catchError, throwError, map, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Login } from '../login/models/Login';
import { API_CONFIG } from 'src/app/config/api-config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Util } from '../../utils/Util';
import { EmpresaSimplificada } from 'src/app/shared/header/models/EmpresaSimplificada';
import { DadosDashBoardEmpresa } from '../dashboard/models/DadosDashBoardEmpresa';
import { Notificacao } from 'src/app/shared/header/models/Notificacao';
import { PlanoResponse } from '../assinaturas/models/PlanoResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  httpOptionsLogin = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
  };

  private httpOptions = {
    params: new HttpParams({
    }),
    headers: new HttpHeaders({
      'Authorization': JSON.parse(localStorage.getItem("Authorization")) || null
    }),
    body: null
  }

  jwtService: JwtHelperService = new JwtHelperService();

  isAuthenticated(): boolean {
    let token = localStorage.getItem('Authorization');
    if (Util.isEmptyString(token)) {
      localStorage.clear();
      return false;
    }
    else {
      return !this.jwtService.isTokenExpired(token);
    }
  }

  public realizaLogin(login: Login): Observable<any> {
    return this.http.post<Login>(`${API_CONFIG.loginUrl}`, login, this.httpOptionsLogin).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
    )
  }

  public obtemNotificacoesEmpresa(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${API_CONFIG.baseUrl}/notificacao`, this.httpOptions).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    );
  }

  public setaNotificacoesComoLidas(): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}/notificacao/marcar-como-lido`, this.httpOptions).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    );
  }

  public obtemNomeSaldoEmpresa(): Observable<EmpresaSimplificada> {
    return this.http.get<EmpresaSimplificada>(`${API_CONFIG.baseUrl}/empresa/simplificado`, this.httpOptions).pipe(
      map((resposta) => new EmpresaSimplificada(resposta)),
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    );
  }

  public obtemDadosEstatisticosEmpresa(): Observable<DadosDashBoardEmpresa> {
    return this.http.get<DadosDashBoardEmpresa>(`${API_CONFIG.baseUrl}/empresa/dashboard`, this.httpOptions).pipe(
      map((resposta) => new DadosDashBoardEmpresa(resposta)),
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    );
  }

  public obtemDadosGraficoFaturamentoEmpresa(): Observable<DadosDashBoardEmpresa> {
    return this.http.get<DadosDashBoardEmpresa>(`${API_CONFIG.baseUrl}/empresa/grafico-faturamento`, this.httpOptions).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    );
  }

  private implementaLogicaDeCapturaDeErroNaExclusaoDeItens(error: HttpErrorResponse) {
    if (error.status == 403 || error.status == 401) {
      localStorage.clear();
      this.router.navigate(['login']);
      this._snackBar.open('É necessário realizar o login para acessar as funcionalidades do sistema', 'fechar', {
        duration: 3500
      })
    }
    else if (error.status == 400) {
      this._snackBar.open(error.error.error, "Fechar", {
        duration: 3500
      });
    }
    else {
      this._snackBar.open("Houve uma falha de comunicação com o servidor", "Fechar", {
        duration: 3500
      });
    }
  }
}
