import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { specialtyModel } from '../../models/specialtyModel';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyServiceService {
  private myApiUrl = "api/Specialty/"
  constructor(private http:HttpClient) { }

  getAllSpecialties(idcenter:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + idcenter)
                .pipe(
                  catchError(this.handleError)
                );
  }

  getSpecialty(id:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + "?id=" + id)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addSpecialty(specialty:specialtyModel, idcenter:number):Observable<any>{
    specialty.idCenter = idcenter;
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, specialty)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addSpecialtyByFile(file: File, idCenter:number): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post(environment.apiBaseUrl + this.myApiUrl + idCenter, formData )
                .pipe(
                  catchError(this.handleError)
                );
  }

  updateSpecialty(specialty:specialtyModel):Observable<any>{
    return this.http.put(environment.apiBaseUrl + this.myApiUrl, specialty)
                .pipe(
                  catchError(this.handleError)
                );
  }

  deleteSpecialty(id:number):Observable<any>{
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

    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'))
  }
}
