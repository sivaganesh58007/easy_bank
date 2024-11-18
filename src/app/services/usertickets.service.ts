import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserticketsService {

  private baseUrl = 'http://127.0.0.1:5000/user-tickets'; // Replace with your API URL

  

  constructor(private http:HttpClient) { }
  getTickets():Observable<any[]>{
    const token=sessionStorage.getItem('token')
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`)

    return this.http.get<any>(this.baseUrl,{headers})
  }

  private messageurl = 'http://127.0.0.1:5000/messages'; // Replace with your API URL



getMessages(ticketId: string): Observable<any> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  console.log(token)
  console.log(12)
  console.log(ticketId)
  return this.http.get<any>(`${this.messageurl}/${ticketId}`, { headers });
}


sendMessage(messagePayload: any): Observable<any> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  console.log(messagePayload.ticket_id)
  return this.http.post<any>(`${this.messageurl}/${messagePayload.ticket_id}`, messagePayload, { headers });
}










}