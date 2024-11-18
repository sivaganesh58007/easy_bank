import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DepositWithdrawService {
  private apiUrl = 'http://127.0.0.1:5000';  
  constructor(private http: HttpClient) { }

  depositFunds(accountNumber: string, amount: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    const body = { account_number: accountNumber, amount: amount };

    return this.http.post<any>(`${this.apiUrl}/deposite`, body, { headers})
 
  }

  withdrawFunds(amount: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    
    const body = { amount: amount };
    return this.http.post<any>(`${this.apiUrl}/withdraw`, body, { headers  })

  }
}
