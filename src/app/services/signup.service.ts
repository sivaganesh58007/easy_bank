import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {


  constructor(private http: HttpClient) { }

  checkEmail(email: string): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:5000/check-email`, { email });
  }

  register(formData: any): Observable<any> {
    return this.http.post(`http://127.0.0.1:5000/signup`, formData);
  }
}
