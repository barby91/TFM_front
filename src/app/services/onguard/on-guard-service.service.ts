import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { request } from '../../models/request';

@Injectable({
  providedIn: 'root'
})
export class OnGuardServiceService {

  private myApiUrl = "api/GuardAssignment/"
  constructor(private http:HttpClient) { }
  
  calculateGuards(request:request):Observable<any>{
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, request)
                .pipe(
                  catchError(this.handleError)
                );
  }

  getGuardAssigment(idCenter:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + "?idCenter=" + idCenter)
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

    return throwError(() => new Error(error.error + '. Por favor intente nuevamente.'))
  }
}
