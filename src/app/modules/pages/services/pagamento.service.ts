import { Observable, map, retry, throwError, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_CONFIG } from 'src/app/config/api-config';
import { PagamentoPageObject } from '../assinaturas/models/pagamentos/PagamentoPageObject';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  private httpOptions = {
    params: new HttpParams({
    }),
    headers: new HttpHeaders({
      'Authorization': API_CONFIG.devToken
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

  public getPagamentos(pagamentoPageObject: PagamentoPageObject, idPlano: number): Observable<PagamentoPageObject> {
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

  private buildRequestParams(busca: string) {
    if (busca != null && busca != undefined && busca != '') {
      this.httpOptions.params = this.httpOptions.params.set('busca', busca)
    }
  }

  private buildPageableParams(pagamentoPageObject: PagamentoPageObject) {
    if (pagamentoPageObject != null) {
      this.httpOptions.params = this.httpOptions.params.set('page', pagamentoPageObject.pageNumber);
      this.httpOptions.params = this.httpOptions.params.set('size', pagamentoPageObject.pageSize);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,' + pagamentoPageObject.sortDirection);
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,' + pagamentoPageObject.sortDirection);
    }
    else {
      this.httpOptions.params = this.httpOptions.params.set('page', 0);
      this.httpOptions.params = this.httpOptions.params.set('size', 10);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,DESC');
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,DESC');
    }
  }

  private implementaLogicaDeCapturaDeErroNaListagemDeItens(error) {
    if (error.status == 403) {
      /*  Quando implantar ng-guard, implementar meio de não permitir duplicidade de acesso nesse método,
       pois o de metadados e o de obtenção paginada irão acessa-lo em caso de erro de servidor. Uma boa
       ideia para resolver esse problema, seria verificar se existe algum token ativo no localstorage para
       acessar a condição do método */
      console.log('Sem autorização, elaborar lógica de logout e redirect no método');
    }
    else {
      this._snackBar.open("Houve uma falha de comunicação com o servidor", "Fechar", {
        duration: 12000
      });
    }
  }

}
