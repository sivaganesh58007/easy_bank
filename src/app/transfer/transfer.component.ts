import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferService } from '../services/transfer.service';
import * as bootstrap from 'bootstrap';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  message: string | null = null;
  isLoading: boolean = false; // Flag to control loading state
  successMessage: string = ''; // Message to display on success
  errorMessage: string=''
  isModalOpen = false;

  constructor(private fb: FormBuilder, private transferService: TransferService,  private toastr: ToastrService // Inject ToastrService
  ) {
    this.transferForm = this.fb.group({
      recipient_account_number: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  processing(){
    
    const accountNumberControl = this.transferForm.get('recipient_account_number');
    const amountControl = this.transferForm.get('amount');


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
    }
    else{
      this.errorMessage=''
      this.isModalOpen=true
      this.isLoading=true
  setTimeout(()=>{
        this.onSubmit()
      },3000)
    }
}
    
    
  onSubmit() {
      this.transferService.transferMoney(this.transferForm.value).subscribe(response=>{
                    this.isLoading = false;
                    this.isModalOpen=false
                        this.successMessage=response.message
                        this.toastr.success(this.successMessage,'Sucess',{
                          progressBar:true
                        })
                        this.transferForm.reset()
  },
      (error)=>{

            if(error.status==404){
              this.isLoading=false
              this.isModalOpen=false

              this.successMessage=error.error.message
              this.toastr.error(this.successMessage,'Failed',{
                progressBar:true
              })
              this.transferForm.reset()



              
            }
            else if(error.status===0){
              this.successMessage='Server Failure'
              this.isLoading=false
              this.isModalOpen=false

              this.toastr.error(this.successMessage,'Failed',{
                progressBar:true
              })

              this.transferForm.reset()


            }

      })
    
   

}



}


