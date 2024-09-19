import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { realUserModel } from '../../models/realUserModel';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private myApiUrl = "api/User/"

  constructor(private http:HttpClient) {}

  getAllUser(idcenter:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + idcenter)
                .pipe(
                  catchError(this.handleError)
                );
  }

  getUser(id:number):Observable<any>{
    return this.http.get(environment.apiBaseUrl + this.myApiUrl + "?id=" + id)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addUser(user:realUserModel, idcenter:number):Observable<any>{
    user.centerId = idcenter;
    user.email = user.name + "." + user.surname + "@salud.madrid.org";
    return this.http.post(environment.apiBaseUrl + this.myApiUrl, user)
                .pipe(
                  catchError(this.handleError)
                );
  }

  addUserByFile(file: File, idCenter:number): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post(environment.apiBaseUrl + this.myApiUrl + idCenter, formData )
                .pipe(
                  catchError(this.handleError)
                );
  }

  updateUser(user:realUserModel):Observable<any>{
    return this.http.put(environment.apiBaseUrl + this.myApiUrl, user)
                .pipe(
                  catchError(this.handleError)
                );
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete(environment.apiBaseUrl + this.myApiUrl + id)
                .pipe(
                  catchError(this.handleError)
                );
  }

  private handleError(error:HttpErrorResponse)
  {
    console.log(error);
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
