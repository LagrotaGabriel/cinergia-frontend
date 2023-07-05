import { Observable, catchError, throwError, map } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Login } from '../login/models/Login';
import { API_CONFIG } from 'src/app/config/api-config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Util } from '../../utils/Util';
import { EmpresaSimplificada } from 'src/app/shared/header/models/EmpresaSimplificada';
import { DadosDashBoardEmpresa } from '../dashboard/models/DadosDashBoardEmpresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

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

  public obtemNomeSaldoEmpresa(): Observable<EmpresaSimplificada> {
    return this.http.get<EmpresaSimplificada>(`${API_CONFIG.baseUrl}/empresa/simplificado`, this.httpOptions).pipe(
      map((resposta) => new EmpresaSimplificada(resposta)),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      })
    );
  }

  public obtemDadosEstatisticosEmpresa(): Observable<DadosDashBoardEmpresa> {
    return this.http.get<DadosDashBoardEmpresa>(`${API_CONFIG.baseUrl}/empresa/dashboard`, this.httpOptions).pipe(
      map((resposta) => new DadosDashBoardEmpresa(resposta)),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      })
    );
  }

  public obtemDadosGraficoFaturamentoEmpresa(): Observable<DadosDashBoardEmpresa> {
    return this.http.get<DadosDashBoardEmpresa>(`${API_CONFIG.baseUrl}/empresa/grafico-faturamento`, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      })
    );
  }
}
