import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminticketsService {


  constructor(private http:HttpClient) { }
  private baseUrl = 'http://127.0.0.1:5000/all-users-tickets';


  getTickets():Observable<any[]>{
    const token=sessionStorage.getItem('token')
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`)

    return this.http.get<any>(this.baseUrl,{headers})
  }


  private baseUrl2 = 'http://127.0.0.1:5000/messages';



  getMessages(ticketId: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token)
    console.log(12)
    console.log(ticketId)
    return this.http.get<any>(`${this.baseUrl2}/${ticketId}`, { headers });
  }
  


  sendMessage(messagePayload:any):Observable<any>{
    const token = sessionStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`)
    console.log(messagePayload.ticket_id)  
    console.log('hi it is data from huhu',messagePayload.user_id)


    return this.http.post<any>(`${this.baseUrl2}/${messagePayload.ticket_id}`,messagePayload,{headers})
  }



  










}
