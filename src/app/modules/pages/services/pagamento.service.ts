import { Observable, map, retry, throwError, catchError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_CONFIG } from 'src/app/config/api-config';
import { PagamentoPageObject } from '../assinaturas/models/pagamentos/PagamentoPageObject';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

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

  public getPagamentosCliente(pagamentoPageObject: PagamentoPageObject, idCliente: number): Observable<PagamentoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildPageableParams(pagamentoPageObject);
    return this.http.get<PagamentoPageObject>(`${API_CONFIG.baseUrl}/pagamento/cliente/${idCliente}`, this.httpOptions).pipe(
      map(resposta => new PagamentoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public getPagamentosPlano(pagamentoPageObject: PagamentoPageObject, idPlano: number): Observable<PagamentoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildPageableParams(pagamentoPageObject);
    return this.http.get<PagamentoPageObject>(`${API_CONFIG.baseUrl}/pagamento/${idPlano}`, this.httpOptions).pipe(
      map(resposta => new PagamentoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public getPagamentos(valorBusca: string, pagamentoPageObject: PagamentoPageObject): Observable<PagamentoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildRequestParams(valorBusca);
    this.buildPageableParams(pagamentoPageObject);
    return this.http.get<PagamentoPageObject>(`${API_CONFIG.baseUrl}/pagamento`, this.httpOptions).pipe(
      map(resposta => new PagamentoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public getPagamentosAprovados(pagamentoPageObject: PagamentoPageObject): Observable<PagamentoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildPageableParams(pagamentoPageObject);
    return this.http.get<PagamentoPageObject>(`${API_CONFIG.baseUrl}/pagamento/aprovados`, this.httpOptions).pipe(
      map(resposta => new PagamentoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public obtemRelatorioPagamentos(listaDeIds: number[]): any {
    this.http.post(`${API_CONFIG.baseUrl}/pagamento/relatorio`, listaDeIds, { headers: this.httpOptions.headers, responseType: "blob" })
      .subscribe(
        ((response) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(blob);
          let tagUrlRelatorio = document.createElement('a');
          tagUrlRelatorio.href = fileURL;
          tagUrlRelatorio.target = '_blank';
          tagUrlRelatorio.download = 'relatorio-pagamentos-' + new Date().getTime().toString() + '.pdf';
          document.body.appendChild(tagUrlRelatorio);
          tagUrlRelatorio.click();
        })
      );
  }

  private buildRequestParams(busca: string) {
    if (busca != null && busca != undefined && busca != '') {
      this.httpOptions.params = this.httpOptions.params.set('busca', busca)
    }
  }

  private buildPageableParams(pagamentoPageObject: PagamentoPageObject) {
    console.log(pagamentoPageObject);
    if (pagamentoPageObject != null) {
      this.httpOptions.params = this.httpOptions.params.set('page', pagamentoPageObject.pageNumber);
      this.httpOptions.params = this.httpOptions.params.set('size', pagamentoPageObject.pageSize);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,DESC');
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,DESC');
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
