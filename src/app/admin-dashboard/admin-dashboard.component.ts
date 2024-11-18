import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  userForm!: FormGroup;
  showModal:boolean=false;
  showformModal:boolean=false;
  otpForm!: FormGroup;  
  errorMessage:string|null=null;
  emailError: string | null = null; 
  formError: string | null = null;





  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private signupService: SignupService,
    private loginservice:LoginService,
    private toastr: ToastrService

  )
   {}

  ngOnInit(): void {
    
    this.getUsers();
    this.userForm = this.fb.group({
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

  })
  this.otpForm=this.fb.group({
    otp:['',[Validators.required,Validators.minLength(1)  ]]
  })
}



checkEmail(email: string): void {
  this.formError = null; 
  this.signupService.checkEmail(email).subscribe(data => {
    if(data.exists){
      this.emailError='Email already exists'
    }
    else {
      this.emailError = null; 
    }
  }, 
  (error) => {
    this.emailError = 'An error occurred while checking the email.';
  });
}

onEmailBlur(): void {
  const emailControl = this.userForm.get('email');
  if (emailControl?.valid) {
    this.checkEmail(emailControl.value);
  } else {
    this.emailError = 'Please enter a valid email address.';
  }
}


  getUsers(): void {
    this.http.get<any>(`http://127.0.0.1:5000/getdetails`).subscribe(
      data => this.users = data.users,
      error => console.error('Error fetching users:', error)
    );
  }
  openModal(){
    this.showModal=true


}
openformModal(){
  this.showformModal=true
  this.userForm.reset()

}

closeModal(){
    this.showModal=false


  }
  closeformModal(){
    this.showformModal=false
  }




  otpsubmit(){
    this.formError = null;

    if (this.userForm.invalid || this.emailError) {
      if (this.userForm.get('password')?.hasError('passwordLength')) {
        this.formError=''
        
      } else if (this.userForm.get('password')?.hasError('passwordComplexity')) {
       this.formError=''
        
      
      } 
      else {
        this.formError = 'Fill all the details before submitting';
        this.emailError=''
      }
      return;
    }
    const email={
      email:this.userForm.value['email']
    }
    this.loginservice.signupOtp(email).subscribe(data=>{

      this.showModal=true
      
    },
  
    )
    
  }

  addUser(): void {  
    const formData = this.userForm.value;
    const otpData = this.otpForm.value;

    const combinedData = {
      ...formData,
      otp: otpData.otp  // Assuming otpData has an 'otp' field
    };

  

    this.http.post(`http://127.0.0.1:5000/signup`, combinedData).subscribe(
      data => {
          this.toastr.show('user can signin with their credentials','user signup sucessfully', {
            toastClass: 'user-toast',
          });
          this.showModal=false
          this.showformModal=false
          this.otpForm.reset()
        
        this.getUsers();
      },
      error => {
        if(error.status===400){
          console.log(111)
          this.formError=error.error.message
          this.otpForm.reset()

          
        }
        else{
            this.formError='error while adding the user'

        }
        console.error('Error adding user:', error);
      }
    );
  }
}
