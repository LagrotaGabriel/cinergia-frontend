import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Login } from '../login/models/Login';
import { API_CONFIG } from 'src/app/config/api-config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Util } from '../../utils/Util';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
  };

  jwtService: JwtHelperService = new JwtHelperService();

  isAuthenticated(): boolean {
    let token = localStorage.getItem('Authorization');
    if (Util.isEmptyString(token)) return false;
    else {
      return !this.jwtService.isTokenExpired(token);
    }
  }

  public realizaLogin(login: Login): Observable<any> {
    return this.http.post<Login>(`${API_CONFIG.loginUrl}`, login, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new HttpErrorResponse(error));
      }),
    )
  }
}
