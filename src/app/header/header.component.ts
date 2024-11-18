import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  role: string | null = null;
  sidebarOpen: boolean = false;
  private authSubscription: Subscription = new Subscription();
  private roleSubscription: Subscription = new Subscription();

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    // Subscribe to authentication status changes
    this.authSubscription = this.loginService.isAuthenticated$.subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });

    // Subscribe to role changes
    this.roleSubscription = this.loginService.role$.subscribe(userRole => {
      this.role = userRole;
    });
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  selectOption() {
    this.sidebarOpen = false; 
  }
  onLogout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.roleSubscription.unsubscribe();
  }
}
