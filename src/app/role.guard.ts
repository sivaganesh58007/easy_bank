import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../app/services/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate { // Changed name from AuthGuard to RoleGuard
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.loginService.getRole();
    const requiredRole = next.data['role'];
    if (role === requiredRole) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
