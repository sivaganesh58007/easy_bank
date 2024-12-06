import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:5000/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  updateProfile(data: any): Observable<any> {
    console.log(data,'dfd')
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(this.apiUrl, data, { headers });
  }

  // uploadProfileImage(formData: FormData): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`  // Send token in header
  //   });

  //   return this.http.post<any>(`${this.apiUrl}/profile/upload-image`, formData, {
  //     headers,
  //     observe: 'response'  // To get the full response, which may contain the image URL
  //   });
  // }
}
