import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';

import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientePageObject } from '../clientes/models/ClientePageObject';
import { ClienteRequest } from '../clientes/models/ClienteRequest';
import { ClienteResponse } from '../clientes/models/ClienteResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private router: Router) { }

  private httpOptions = {
    params: new HttpParams({
    }),
    headers: new HttpHeaders({
      'Authorization': JSON.parse(localStorage.getItem("Authorization")) || null
    }),
    body: null
  }

  public obtemImagemPerfilCliente(idCliente: number): Observable<any> {
    return this.http.get(`${API_CONFIG.baseUrl}/cliente/imagem-perfil/${idCliente}`,
      { headers: this.httpOptions.headers, responseType: "blob" }).pipe(
        catchError((error: HttpErrorResponse) => {
          this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
          console.log(error);
          return throwError(() => new HttpErrorResponse(error));
        }),
      )
  }

  public atualizaImagemPerfilCliente(idCliente: number, imagemPerfil: Blob): Observable<ClienteResponse> {
    this.httpOptions.body = null;
    let formData = new FormData();
    formData.append("imagemPerfil", imagemPerfil);
    return this.http.put<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente/imagem-perfil/${idCliente}`, formData, this.httpOptions).pipe(
      map((response) => new ClienteResponse(response)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
    )
  }

  public obtemDetalhesDoClientePorId(id: number): Observable<ClienteResponse> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    return this.http.get<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente/${id}`, this.httpOptions).pipe(
      map((resposta) => new ClienteResponse(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
    )
  }

  public getClientes(valorBusca: string, clientePageObject: ClientePageObject): Observable<ClientePageObject> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    this.buildRequestParams(valorBusca);
    this.buildPageableParams(clientePageObject);
    return this.http.get<ClientePageObject>(`${API_CONFIG.baseUrl}/cliente`, this.httpOptions).pipe(
      map(resposta => new ClientePageObject(resposta)),
      catchError((error: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaListagemDeItens(error);
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
      retry({ count: 20, delay: 10000 })
    )
  }

  public novoCliente(clienteRequest: ClienteRequest): Observable<ClienteResponse> {
    this.httpOptions.body = null;
    return this.http.post<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente`, clienteRequest, this.httpOptions).pipe(
      map(resposta => new ClienteResponse(resposta)),
    )
  }

  public atualizaCliente(idCliente: number, clienteRequest: ClienteRequest): Observable<ClienteResponse> {
    this.httpOptions.body = null;
    return this.http.put<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente/${idCliente}`, clienteRequest, this.httpOptions).pipe(
      map(resposta => new ClienteResponse(resposta)),
    )
  }

  public validaDuplicidadeCpfCnpj(cpfCnpj: string) {
    this.httpOptions.body = null;
    return this.http.post(`${API_CONFIG.baseUrl}/cliente/verifica-cpfCnpj`, cpfCnpj, this.httpOptions).pipe(
      catchError((erro: HttpErrorResponse) => {
        console.log(erro);
        if (erro.status != 403 && erro.status != 0) return throwError(() => new Error((erro.error.error).toString().replace("Error:", "")));
        else if (erro.status == 403) return throwError(() => new Error('Ops! Ocorreu um erro de autenticação'));
        else return throwError(() => new Error('Ops! Ocorreu um erro de conexão com o servidor'));
      })
    )
  }

  public removeCliente(id: number): Observable<ClienteResponse> {
    this.httpOptions.body = null;
    return this.http.delete<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente/${id}`, this.httpOptions).pipe(
      map(resposta => new ClienteResponse(resposta)),
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    )
  }

  public removeClienteEmMassa(listaDeIds: number[]) {
    this.httpOptions.body = listaDeIds;
    return this.http.delete(`${API_CONFIG.baseUrl}/cliente`, this.httpOptions).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.implementaLogicaDeCapturaDeErroNaExclusaoDeItens(httpErrorResponse);
        return throwError(() => new HttpErrorResponse(httpErrorResponse));
      })
    )
  }

  public obtemRelatorioClientes(listaDeIds: number[]): any {
    this.http.post(`${API_CONFIG.baseUrl}/cliente/relatorio`, listaDeIds, { headers: this.httpOptions.headers, responseType: "blob" })
      .subscribe(
        ((response) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(blob);
          let tagUrlRelatorio = document.createElement('a');
          tagUrlRelatorio.href = fileURL;
          tagUrlRelatorio.target = '_blank';
          tagUrlRelatorio.download = 'relatorio-clientes-' + new Date().getTime().toString() + '.pdf';
          document.body.appendChild(tagUrlRelatorio);
          tagUrlRelatorio.click();
        })
      );
  }

  public obtemClientePorId(id: number): Observable<ClienteResponse> {
    this.httpOptions.params = new HttpParams();
    this.httpOptions.body = null;
    return this.http.get<ClienteResponse>(`${API_CONFIG.baseUrl}/cliente/${id}`, this.httpOptions).pipe(
      map((resposta) => new ClienteResponse(resposta))
    )
  }

  private buildRequestParams(busca: string) {
    if (busca != null && busca != undefined && busca != '') {
      this.httpOptions.params = this.httpOptions.params.set('busca', busca)
    }
  }

  private buildPageableParams(clientePageObject: ClientePageObject) {
    if (clientePageObject != null) {
      this.httpOptions.params = this.httpOptions.params.set('page', clientePageObject.pageNumber);
      this.httpOptions.params = this.httpOptions.params.set('size', clientePageObject.pageSize);
      this.httpOptions.params = this.httpOptions.params.set('sort', 'dataCadastro,' + clientePageObject.sortDirection);
      this.httpOptions.params = this.httpOptions.params.append('sort', 'horaCadastro,' + clientePageObject.sortDirection);
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
