import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private apiUrl = 'http://127.0.0.1:5000/deposite';  // Ensure this matches your backend URL

  constructor(private http: HttpClient) { }

  depositFunds(accountNumber: string, amount: number): Observable<any> {
    const token = sessionStorage.getItem('token'); // Replace with your token retrieval method
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Include token in Authorization header
    });
    const body = { account_number: accountNumber, amount: amount };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
