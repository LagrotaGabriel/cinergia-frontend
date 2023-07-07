import { PlanoRequest } from './../assinaturas/models/PlanoRequest';
import { Observable, map, catchError, throwError, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_CONFIG } from 'src/app/config/api-config';
import { PlanoPageObject } from '../assinaturas/models/PlanoPageObject';
import { PlanoResponse } from '../assinaturas/models/PlanoResponse';
import { DadosPlanoResponse } from '../assinaturas/models/DadosPlanoResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

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

  public getPlanosCliente(planoPageObject: PlanoPageObject, idCliente: number): Observable<PlanoPageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildPageableParams(planoPageObject);
    return this.http.get<PlanoPageObject>(`${API_CONFIG.baseUrl}/plano/cliente/${idCliente}`, this.httpOptions).pipe(
      map(resposta => new PlanoPageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
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

  public removePlano(idPlano: number): Observable<PlanoResponse> {
    this.httpOptions.body = null;
    return this.http.delete<PlanoResponse>(`${API_CONFIG.baseUrl}/plano/${idPlano}`, this.httpOptions).pipe(
      map(resposta => new PlanoResponse(resposta)),
    )
  }

  public novoPlano(planoRequest: PlanoRequest, idCliente: number): Observable<PlanoResponse> {
    this.httpOptions.body = null;
    return this.http.post<PlanoResponse>(`${API_CONFIG.baseUrl}/plano/${idCliente}`, planoRequest, this.httpOptions).pipe(
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

  public obtemDadosPlanoPorId(id: number): Observable<DadosPlanoResponse> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    return this.http.get<DadosPlanoResponse>(`${API_CONFIG.baseUrl}/plano/dados/${id}`, this.httpOptions).pipe(
      map((resposta) => new DadosPlanoResponse(resposta))
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
