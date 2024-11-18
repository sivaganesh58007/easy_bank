import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';   
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpComponent } from './http/http.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './role.guard';
import { ProfileComponent } from './profile/profile.component';
import { SupportComponent } from './support/support.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TransferComponent } from './transfer/transfer.component';
import { DepositWithdrawComponent } from '../app/deposit-withdraw/deposit-withdraw.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserticketsComponent } from './usertickets/usertickets.component';
import { AdminticketsComponent } from './admintickets/admintickets.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UrlComponent } from './url/url.component';





// Define the routes
const routes: Routes = [
  
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'user-profile', component: ProfileComponent, canActivate: [RoleGuard], data: { role: 'user' } },
  { path: 'support', component: SupportComponent, canActivate: [RoleGuard], data: { role: 'user' } },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [RoleGuard], data: { role: 'user' } },
  {path: 'deposit-withdraw', component: DepositWithdrawComponent},
  { path: 'transfer', component: TransferComponent },
  {path:'Home',component:UserDashboardComponent},
  {path:'transfer',component:TransferComponent},
  // {path:'viewticket',component:ViewticketComponent},
  {path:'userticket',component:UserticketsComponent},
  {path:'transaction_history',component:TransactionHistoryComponent},
  {path:'feedback',component:FeedbackComponent},  
  {path:'all-users-tickets',component:AdminticketsComponent},
  // Add other routes as needed
  { path: '**', redirectTo: '/home' } // Wildcard route for unknown paths
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HttpComponent,
    SignupComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    ProfileComponent,
    SupportComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    TransferComponent,
    DepositWithdrawComponent,
    TransactionHistoryComponent,
    FeedbackComponent,
    UserticketsComponent,
    AdminticketsComponent,
    UrlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes), 
    BrowserAnimationsModule, // Add this
    ToastrModule.forRoot(),
    CommonModule
    


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] , // Allow custom elements like <c-toast-body>

  providers: [RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
