import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
    private apiUrl = 'http://127.0.0.1:5000/transfer'; // Your backend endpoint

    constructor(private http: HttpClient) { }

    transferMoney(transferData: { recipient_account_number: string; amount: number }): Observable<any> {
      return this.http.post<any>(this.apiUrl, transferData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
      });
    }
  }

