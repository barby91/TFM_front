import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { askedHolidayModel } from '../../models/askedHolidayModel';
import { environment } from '../../../environments/environment';
import { Observable, catchError, identity, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AskedHolidayServiceService {
  private myApiUrl = "api/AskedHoliday/"

  constructor(private http:HttpClient) {}

  addAskedHoliday(askedHoliday:askedHolidayModel):Observable<any>{
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, askedHoliday)
                .pipe(
                  catchError(this.handleError)
                );
  }

  updateAskedHoliday(askedHoliday:askedHolidayModel):Observable<any>{
    return this.http.put(environment.apiBaseUrl + this.myApiUrl, askedHoliday)
                .pipe(
                  catchError(this.handleError)
                );
  }

  getAllAskedHolidaysByCenterId(idCenter:number, idUser:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + idCenter + "?idUser=" + idUser)
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

    var message = 'Algo falló. Por favor intente nuevamente';
    if(error.error !== null && error.error !== ""){
      message = error.error;
    }
    return throwError(() => new Error(message))
  }
}
