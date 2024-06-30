import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { userLogRequest } from '../../models/userLogRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private myApiUrl = "api/Login/"

  constructor(private http:HttpClient) {
    console.log(environment);
    console.log(environment.apiBaseUrl);
  }
  
  loginUser(credentials:userLogRequest):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + "?Email=" + credentials.email + "&Password=" + credentials.password)
                .pipe(
                  catchError(this.handleError)
                );
  }

  updateLoggedUser(id:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + id)
                .pipe(
                  catchError(this.handleError)
                );
  }

  private handleError(error:HttpErrorResponse)
  {
    if(error.status === 0)
    {
      console.error('Se ha producido un error ', error.error)
    }
    else
    {
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }

    return throwError(() => new Error('Algo falló. Por favor intente nuevamente'))
  }
}