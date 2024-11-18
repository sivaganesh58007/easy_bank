import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepositWithdrawService } from '../services/deposit-withraw.service';  // Adjust path as needed
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


// import * as bootstrap from 'bootstr  ap'; // Import Bootstrap for modal control
declare var bootstrap:any;


@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  styleUrls: ['./deposit-withdraw.component.css']
})
export class DepositWithdrawComponent{
  depositWithdrawForm: FormGroup;
  showAccountNumber = true; 
  transactionType = 'deposit';  
  isLoading: boolean = false; 
  successMessage: string = ''; 
  errorMessage: string | null = null;
  isModalOpen:boolean=false
 




  constructor(private fb: FormBuilder, private depositWithdrawService: DepositWithdrawService,private router: Router,
      private toastr: ToastrService // Inject ToastrService

  ) {
    this.depositWithdrawForm = this.fb.group({
      transactionType: ['deposit', Validators.required],
      accountNumber: ['',[Validators.required ,Validators.minLength(15),Validators.maxLength(15)]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }
  

  onTransactionTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.transactionType = selectElement.value;
    this.showAccountNumber = this.transactionType === 'deposit';

    if (this.transactionType === 'withdraw') {
      this.depositWithdrawForm.get('accountNumber')?.clearValidators();
    } else {
      this.depositWithdrawForm.get('accountNumber')?.setValidators(Validators.required);
    }
    this.depositWithdrawForm.get('accountNumber')?.updateValueAndValidity();
  }

processing():void{

  const accountNumberControl = this.depositWithdrawForm.get('accountNumber');
  const amountControl = this.depositWithdrawForm.get('amount');
  const transactionType=this.depositWithdrawForm.get('trasactiontype')
  

  if(transactionType?.invalid){
    this.errorMessage='please select the transaction type'
    return

  }

  if(accountNumberControl?.invalid && amountControl?.invalid){

    this.errorMessage='please fill the form'
    return
    
  }

  if(accountNumberControl?.invalid){

    this.errorMessage='Account number should be 15 digits'
    return
  }
  else if (amountControl?.invalid) {
    this.errorMessage='please enter valid amount'
    return;
  }else{

    this.isModalOpen=true
    this.isLoading = true;

    this.errorMessage=''

      setTimeout(()=>{
        this.onSubmit()
      },3000)
    }

}
  onSubmit(): void {
     this.errorMessage=''
    if (this.depositWithdrawForm.valid) {
      const { transactionType, accountNumber, amount } = this.depositWithdrawForm.value;
      
      if (transactionType === 'deposit') {
       
        this.depositWithdrawService.depositFunds(accountNumber, amount).subscribe(
          (response)=>{
                this.depositWithdrawForm.reset();
                this.isModalOpen=false
                this.isLoading = false; 
                this.successMessage = ''; 
                this.errorMessage = '';       
                this.successMessage = response.message;
                this.toastr.success(this.successMessage, 'Success',{
                          progressBar: true,
                        })
                this.depositWithdrawForm.reset()
          }, (error) => {
            if(error.status === 404){
              this.isLoading=false
              this.isModalOpen=false
              this.successMessage = error.error.message;
              this.toastr.error(this.successMessage,'Failed',{
                progressBar: true, // Show progress bar

              })
              this.depositWithdrawForm.reset()
            }else if (error.status === 0) {
              this.isLoading=false
              this.isModalOpen=false
              this.successMessage = 'Server Failure';
              this.toastr.error(this.successMessage,'Failed',{
                progressBar: true, // Show progress bar
              })
              this.depositWithdrawForm.reset()
            }
          }       
        )    
      } 
      else if (transactionType === 'withdraw') {
        this.depositWithdrawService.withdrawFunds(amount).subscribe(
          (response)=> {
            this.depositWithdrawForm.reset();
              this.isLoading = false; 
              this.isModalOpen=false
              this.successMessage = response.message;
              this.toastr.success(this.successMessage)             
          },(error) => {
           
            if(error.status === 404){
              this.isLoading=false
              this.isModalOpen=false

              this.successMessage = error.error.message;
              this.toastr.error(this.successMessage,'Failed',{
                progressBar: true, 

              })
        }
        else if (error.status === 0) {
          this.isLoading=false
          this.isModalOpen=false


          this.successMessage = 'Server Failure';
          this.toastr.error(this.successMessage,'Failed',{
            progressBar: true, 

          })
        } 
      }
      )
      }
    }
   } 



}
