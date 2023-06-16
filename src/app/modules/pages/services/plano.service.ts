import { PlanoRequest } from './../assinaturas/models/PlanoRequest';
import { Observable, map, catchError, throwError, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_CONFIG } from 'src/app/config/api-config';
import { PlanoPageObject } from '../assinaturas/models/PlanoPageObject';
import { PlanoResponse } from '../assinaturas/models/PlanoResponse';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  private httpOptions = {
    params: new HttpParams({
    }),
    headers: new HttpHeaders({
      'Authorization': API_CONFIG.devToken
    }),
    body: null
  }

  public getPlanos(valorBusca: string, planoPageObject: PlanoPageObject): Observable<PlanoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildRequestParams(valorBusca);
    this.buildPageableParams(planoPageObject);
    return this.http.get<PlanoPageObject>(`${API_CONFIG.baseUrl}/plano`, this.httpOptions).pipe(
      map(resposta => new PlanoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public novoPlano(planoRequest: PlanoRequest): Observable<PlanoResponse> {
    this.httpOptions.body = null;
    return this.http.post<PlanoResponse>(`${API_CONFIG.baseUrl}/plano`, planoRequest, this.httpOptions).pipe(
      map(resposta => new PlanoResponse(resposta)),
    )
  }

  public atualizaPlano(idPlano: number, planoRequest: PlanoRequest): Observable<PlanoResponse> {
    this.httpOptions.body = null;
    return this.http.put<PlanoResponse>(`${API_CONFIG.baseUrl}/plano/${idPlano}`, planoRequest, this.httpOptions).pipe(
      map(resposta => new PlanoResponse(resposta)),
    )
  }

  public obtemRelatorioPlanos(listaDeIds: number[]): any {
    this.http.post(`${API_CONFIG.baseUrl}/plano/relatorio`, listaDeIds, { headers: this.httpOptions.headers, responseType: "blob" })
      .subscribe(
        ((response) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(blob);
          let tagUrlRelatorio = document.createElement('a');
          tagUrlRelatorio.href = fileURL;
          tagUrlRelatorio.target = '_blank';
          tagUrlRelatorio.download = 'relatorio-planos-' + new Date().getTime().toString() + '.pdf';
          document.body.appendChild(tagUrlRelatorio);
          tagUrlRelatorio.click();
        })
      );
  }

  public obtemPlanoPorId(id: number): Observable<PlanoResponse> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    return this.http.get<PlanoResponse>(`${API_CONFIG.baseUrl}/plano/${id}`, this.httpOptions).pipe(
      map((resposta) => new PlanoResponse(resposta))
    )
  }

  private buildRequestParams(busca: string) {
    if (busca != null && busca != undefined && busca != '') {
      this.httpOptions.params = this.httpOptions.params.set('busca', busca)
    }
  }

  private buildPageableParams(planoPageObject: PlanoPageObject) {
    if (planoPageObject != null) {
      this.httpOptions.params = this.httpOptions.params.set('page', planoPageObject.pageNumber);
      this.httpOptions.params = this.httpOptions.params.set('size', planoPageObject.pageSize);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,' + planoPageObject.sortDirection);
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,' + planoPageObject.sortDirection);
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
