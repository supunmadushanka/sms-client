import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  private studentGet: string = `${environment.baseURL}students/getall`;
  private studentAdd: string = `${environment.baseURL}students/add`;
  private studentUpdate: string = `${environment.baseURL}students/update`;
  private studentDelete: string = `${environment.baseURL}students/delete`;
  private imageAdd: string = `${environment.baseURL}students/addImage`;
  private familyGet: string = `${environment.baseURL}families/getall`;

  constructor(private httpClient: HttpClient) { }

  public getStudents = (): Observable<any> => {
    return this.httpClient.get<any>(this.studentGet).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }

  public addStudent = (model): Observable<any> => {
    return this.httpClient.post<any>(this.studentAdd, model).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }

  public updateStudent = (model): Observable<any> => {
    const httpParams = new HttpParams({ fromObject: model });
    const httpOptions = { withCredentials: false, body: httpParams };
    return this.httpClient.put<any>(this.studentUpdate, httpParams,httpOptions).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }

  public deleteStudent = (model): Observable<any> => {
    const httpParams = new HttpParams({ fromObject: model });
    const httpOptions = { withCredentials: false, body: httpParams };
    return this.httpClient.delete<any>(this.studentDelete, httpOptions).pipe(
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
  
  public addImage = (model,studentId): Observable<any> => {
    return this.httpClient.put<any>(`${this.imageAdd}/${studentId}`,model).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }
}
