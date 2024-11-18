import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http:HttpClient) { }


  private apiUrl = 'http://127.0.0.1:5000/ticket';


  sendTicket(data:any):Observable<any>{
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl,data,{headers})
  }
  
  



}
