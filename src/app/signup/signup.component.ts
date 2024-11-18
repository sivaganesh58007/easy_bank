import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { LoginService } from '../services/login-service.service';
import { ToastrService } from 'ngx-toastr';

function passwordLengthValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.value;
  return password && (password.length < 8 || password.length > 16) ? { 'passwordLength': true } : null;
}

function passwordComplexityValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.value;
  return password && (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password) || !/(?=.*\d)/.test(password)) 
    ? { 'passwordComplexity': true } 
    : null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  emailError: string | null = null;
  formError: string | null = null;
  showModal:boolean=false;
  otpForm!: FormGroup; 


  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private loginservice:LoginService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      date_of_birth: ['', Validators.required],
      password: ['', [
        Validators.required,
        passwordLengthValidator,
        passwordComplexityValidator
      ]]
    });


    this.otpForm=this.fb.group({
      otp:['',[Validators.required,Validators.minLength(1)  ]]
    })


  }

 


  checkEmail(email: string): void {
    this.emailError = null; // Clear previous email error
    this.signupService.checkEmail(email).subscribe(data => {
      if(data.exists){
        this.emailError='Email already exists'
      }
    }, 
    (error) => {
      this.emailError = 'An error occurred while checking the email.';
    });
  }

  onEmailBlur(): void {
    const emailControl = this.signupForm.get('email');
    if (emailControl?.valid) {
      this.checkEmail(emailControl.value);
    } else {
      this.emailError = 'Please enter a valid email address.';
    }
  }




  otpsubmit(){
    this.formError = null;

    if (this.signupForm.invalid || this.emailError) {
      if (this.signupForm.get('password')?.hasError('passwordLength')) {
        this.formError=''
        
      } else if (this.signupForm.get('password')?.hasError('passwordComplexity')) {
       this.formError=''
        
      
      } 
      else {
        this.formError = 'Fill all the details before submitting';
        this.emailError=''
      }
      return;
    }
    const email={
      email:this.signupForm.value['email']
    }
    this.loginservice.signupOtp(email).subscribe(data=>{
      this.showModal=true
      
    },
  
    )
    
  }





  onSubmit(): void {
   





    const formData = this.signupForm.value;
    const otpData = this.otpForm.value;


    const combinedData = {
      ...formData,
      otp: otpData.otp  
    };


    if(this.otpForm.invalid){
      this.formError='please enter valid otp'
    }
    
    this.signupService.register(combinedData).subscribe(
      (data: any) => {
        if (data.message === 'User created successfully') {
          this.toastr.show('signin with your credentials','signup sucessfully', {
            toastClass: 'user-toast',
          });
          this.router.navigate(['/signin']);
        }
      },
      (error) => {
        if(error.status===400){
          this.formError=error.error.message
        }
       
      }
    );
    
  }

  closeModal(){
    this.showModal=false  
  }



  
}
