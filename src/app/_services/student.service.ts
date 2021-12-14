import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  public customError = {
    status: 500,
    message: 'Sorry! Something went wrong :('
  }

  private studentAdd: string = `${environment.baseURL}students/add`;
  private familyGet: string = `${environment.baseURL}families/getall`;

  constructor(private httpClient: HttpClient) { }

  public addStudent = (model): Observable<any> => {
    return this.httpClient.post<any>(this.studentAdd, model).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }

  public getFamilies = (): Observable<any> => {
    return this.httpClient.get<any>(this.familyGet).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }
}
