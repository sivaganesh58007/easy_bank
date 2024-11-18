import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://127.0.0.1:5000/feedback'; 
  constructor(private http: HttpClient) {}

  submitFeedback(feedbackData: { rating: number, comment: string }): Observable<any> {
    const token=sessionStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`)
    return this.http.post<any>(this.apiUrl, feedbackData,{headers});
  }
}
