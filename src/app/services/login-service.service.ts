import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string | null>(null);


apiUrl="http://127.0.0.1:5000"


  // Expose public observables
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  

  constructor(private http: HttpClient,private router:Router) {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.roleSubject.next(sessionStorage.getItem('role'));
    
    }
  }
  


  login(credentials: any): Observable<any> {

    return this.http.post('http://127.0.0.1:5000/signin', credentials).pipe(
      tap((response: any) => {
        if (response.access_token) {
          sessionStorage.setItem('token', response.access_token);
          sessionStorage.setItem('role', response.role);
          sessionStorage.setItem('user_id',response.user_id);
            this.isAuthenticatedSubject.next(true);
            this.roleSubject.next(response.role);
        }
      })
    );
  }


  signupOtp(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup-otp`, email);
  }
  sendOtp(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, email);
  }

  // Verify OTP endpoint
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }

  // Reset Password endpoint
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
  

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  getRole(): string | null {
    return this.roleSubject.getValue();
  }

  isLoggedIn():boolean{
    return !(!sessionStorage.getItem('token'))
  }
  navigateToRole():void{
    const role=sessionStorage.getItem('role')
    if (role === 'admin') {
     this.router.navigate(['/admin-dashboard']);
    } else if (role === 'user') {       
       this.router.navigate(['/user-dashboard']);
    }     
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user_id')

    this.isAuthenticatedSubject.next(false);
    this.roleSubject.next(null);
  }

}
