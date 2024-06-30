import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LevelServiceService {
  private myApiUrl = "api/Level/"
  constructor(private http:HttpClient) { }

  getAllLevels():Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl)
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
