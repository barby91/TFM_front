import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { unityModel } from '../../models/unityModel';

@Injectable({
  providedIn: 'root'
})
export class CommonUnityService {
  private myApiUrl = "api/Unity/"
  constructor(private http:HttpClient) { }

  getAllCommonUnity():Observable<any>{
    console.log("Hola");
    return this.http.get(environment.apiBaseUrl + this.myApiUrl)
                .pipe(
                  catchError(this.handleError)
                );
  }

  getCommonUnity(id:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + id)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addCommonUnity(commonUnity:unityModel):Observable<any>{
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, commonUnity)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addCommonUnityByFile(file: File, idCenter:number): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post(environment.apiBaseUrl + this.myApiUrl + idCenter, formData )
                .pipe(
                  catchError(this.handleError)
                );
  }

  updateCommonUnity(specialty:unityModel):Observable<any>{
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, specialty)
                .pipe(
                  catchError(this.handleError)
                );
  }

  deleteCommonUnity(id:number):Observable<any>{
    return this.http.delete(environment.apiBaseUrl + this.myApiUrl + id)
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
