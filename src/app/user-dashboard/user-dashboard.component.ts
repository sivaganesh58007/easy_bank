import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login-service.service';
import { BalanceService } from '../services/balance.service'; 
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  
  currentBalance: number | null = null;

  transactions: any[] = []; // Initialize transactions
  profiledata: any={}

  constructor(
    private loginService: LoginService,
    private balanceService: BalanceService,
    private profileService:ProfileService
  ) {}

  ngOnInit(): void {

    this.profileService.getProfile().subscribe(
      data=>{
        this.profiledata=data
      },
      error=>{
        console.error(error.error.message)
      }
    )
  }

  

  
  viewBalance(): void {
    // Fetch the balance from the backend
    this.balanceService.getBalance().subscribe(
      (response: { current_balance: number }) => {
        this.currentBalance = response.current_balance;

        const balanceAmountElement = document.getElementById('balance-amount');
        const balanceElement = document.getElementById('balance');

        if (balanceAmountElement && balanceElement) {
          balanceAmountElement.innerText = `₹ ${this.currentBalance.toFixed(2)}`;
          balanceElement.style.display = 'block';
        } else {
          console.error('Balance elements not found in the DOM.');
        }
      },
      (error: any) => {
        console.error('Error fetching balance:', error);
        alert(error.message || 'Failed to fetch balance.');
      }
    );
  }
}

