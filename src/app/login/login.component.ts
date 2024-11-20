import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { LoginService } from '../services/login-service.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  otpForm!: FormGroup; 
   errorMessage: string | null = null;
  showModal = false; 
   isOtpSent = false;
  isPasswordReset = false;
isLoading=false
forgetErrorMessage:string|null=null

countdown: number = 300; // 5 minutes in seconds
displayTime: string = '05:00';


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if(this.loginService.isLoggedIn()){
      this.loginService.navigateToRole()
      
    }
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });


    this.emailForm=this.fb.group({
      email:['',[Validators.required,Validators.email]]
    });

    this.otpForm=this.fb.group({
      otp:['',[Validators.required,Validators.minLength(1)  ]]
    })


    this.passwordForm=this.fb.group({
      newPassword: ['', [Validators.required,
                        Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    })
  }  


  onSubmit() {
    if (this.loginForm.invalid) {
      // this.loginForm.markAllAsTouched();
      this.errorMessage = 'enter valid credentials'; // For missing values
      return;
    }
  
    this.loginService.login(this.loginForm.value).subscribe(
      data=>{
        if (data.role === 'admin') {
          this.toastr.show('Admin login successfully', '', {
            toastClass: 'admin-toast',
          });
          this.router.navigate(['/admin-dashboard']);
        } else if (data.role === 'user') {

          this.toastr.show('User login successfully', '', {
            toastClass: 'user-toast',
          });         
           this.router.navigate(['/user-dashboard']);
        }      
      },
      (error)=>{
      
        if(error.status==400|| error.status == 404||error.status==401){
          this.errorMessage=error.error.message

        }
        else{


        }
      }
    );

  }
  openForgotPasswordModal() {
    this.showModal = true;
  this.forgetErrorMessage=''
  this.errorMessage=''
  }


  closeForgotPasswordModal() {
    this.showModal = false;
    this.isOtpSent = false;
    this.isPasswordReset = false;
    this.emailForm.reset();
    this.otpForm.reset();
    this.passwordForm.reset();
    this.errorMessage=null
  } 


  onEmailSubmit() {
    this.forgetErrorMessage=''
   

  
    this.loginService.sendOtp(this.emailForm.value).subscribe(
      data => {

        

        this.toastr.show('Otp Sent Successfully', '', {
          toastClass: 'user-toast',
        });
        this.isOtpSent = true;
        this.errorMessage = '';
        this.startTimer()

      },
      error => {
      if (error.status === 404 || error.status === 400) {
          this.forgetErrorMessage = error.error.message; 
     } 
   
     
     
     else {
       this.forgetErrorMessage = 'An unexpected error occurred. Please try again.';
     } 
          }
    );
  }


  startTimer(): void {
    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        const minutes = Math.floor(this.countdown / 60).toString().padStart(2, '0');
        const seconds = (this.countdown % 60).toString().padStart(2, '0');
        this.displayTime = `${minutes}:${seconds}`;
      } else {
        clearInterval(timer); // Stop the timer when it reaches 0
      }
    }, 1000);
  }

  onOtpSubmit() {
    this.forgetErrorMessage=''
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.forgetErrorMessage='please enter 6 digit otp'
      return;
    }
    const payload = { ...this.emailForm.value, ...this.otpForm.value };
    this.loginService.verifyOtp(payload).subscribe(
      data => {
        this.toastr.show('Otp Verified Successfully', '', {
          toastClass: 'user-toast',
        });
        this.isOtpSent = false;
        this.isPasswordReset = true;
        this.errorMessage = '';
      },
      error => {
        if (error.status === 400) {
          this.forgetErrorMessage=error.error.message
        } 
        else {
          this.forgetErrorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    );
  }


  onPasswordSubmit() {
      // if (this.passwordForm.invalid || this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      //   this.errorMessage = 'please enter 8 digit password';
      //   return;
      // }
      this.forgetErrorMessage=''


      if(this.passwordForm.value.newPassword!=this.passwordForm.value.confirmPassword){
        this.forgetErrorMessage='password mis match'
        return
  
      }
    



    const payload = {...this.emailForm.value, new_password: this.passwordForm.value.newPassword };
    this.loginService.resetPassword(payload).subscribe(
      response => {
        this.toastr.show('Otp changed Successfully', '', {
          toastClass: 'user-toast',
        });
        this.closeForgotPasswordModal();

      },
      error => {
        if (error.status === 400) {
          this.forgetErrorMessage=error.error.message
        } else {
          this.forgetErrorMessage = 'Failed to reset password. Please try again.';
        }
      }
          );
  }
}
