import { Observable, map, catchError, throwError, retry } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TransferenciaPageObject } from '../transferencias/models/TransferenciaPageObject';
import { API_CONFIG } from 'src/app/config/api-config';
import { TransferenciaRequest } from '../transferencias/models/TransferenciaRequest';
import { TransferenciaResponse } from '../transferencias/models/TransferenciaResponse';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  private httpOptions = {
    params: new HttpParams({
    }),
    headers: new HttpHeaders({
      'Authorization': JSON.parse(localStorage.getItem("Authorization")) || null
    }),
    body: null
  }

  public getTransferencias(transferenciaPageObject: TransferenciaPageObject): Observable<TransferenciaPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildPageableParams(transferenciaPageObject);
    return this.http.get<TransferenciaPageObject>(`${API_CONFIG.baseUrl}/transferencia`, this.httpOptions).pipe(
      map(resposta => new TransferenciaPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public novaTransferencia(transferenciaRequest: TransferenciaRequest): Observable<TransferenciaResponse> {
    this.httpOptions.body = null;
    return this.http.post<TransferenciaResponse>(`${API_CONFIG.baseUrl}/transferencia`, transferenciaRequest, this.httpOptions).pipe(
      map(resposta => new TransferenciaResponse(resposta)),
    )
  }

  private buildPageableParams(transferenciaPageObject: TransferenciaPageObject) {
    if (transferenciaPageObject != null) {
      this.httpOptions.params = this.httpOptions.params.set('page', transferenciaPageObject.pageNumber);
      this.httpOptions.params = this.httpOptions.params.set('size', transferenciaPageObject.pageSize);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,' + transferenciaPageObject.sortDirection);
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,' + transferenciaPageObject.sortDirection);
    }
    else {
      this.httpOptions.params = this.httpOptions.params.set('page', 0);
      this.httpOptions.params = this.httpOptions.params.set('size', 10);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,DESC');
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,DESC');
    }
  }

  private implementaLogicaDeCapturaDeErroNaListagemDeItens(error) {
    if (error.status == 403 || error.status == 401) {
      localStorage.clear();
      this.router.navigate(['login']);
      this._snackBar.open('É necessário realizar o login para acessar as funcionalidades do sistema', 'fechar', {
        duration: 3500
      })
    }
    else {
      this._snackBar.open("Houve uma falha de comunicação com o servidor", "Fechar", {
        duration: 12000
      });
    }
  }
}
