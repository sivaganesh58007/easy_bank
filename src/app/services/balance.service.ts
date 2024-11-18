import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balanceUrl = 'http://127.0.0.1:5000/balance'; 

  constructor(private http: HttpClient) {}

  getBalance(): Observable<any> {
    const token = sessionStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any>(this.balanceUrl, { headers });
  }
  
}