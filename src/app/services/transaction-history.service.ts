import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(private http: HttpClient) {}

  getTransactionHistory(filters: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    if (filters.transaction_type) {
      params = params.set('transaction_type', filters.transaction_type);
    }
    if (filters.start_date) {
      params = params.set('start_date', filters.start_date);
    }
    if (filters.end_date) {
      params = params.set('end_date', filters.end_date);
    }
    if (filters.sort_by && filters.order) {
      params = params.set('sort_by', filters.sort_by);
      params = params.set('order', filters.order);
    }

    params = params.set('page', filters.page.toString());
    params = params.set('limit', '10'); 

    return this.http.get<any>('http://127.0.0.1:5000/transaction_history', { headers, params });
  }
}
