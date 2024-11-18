import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { SupportService } from '../services/support.service'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  showOptions = false; // Toggle for showing the main options
  selectedMainOption: string | null = null; // Store the selected main option
  solutionText: string = ''; // The solution text for the selected sub-question
  raiseTicket:string='Raise ticket if you are not satisfied with the solution ';

  subOptions: any[] = []; // Sub-questions list based on selected main option
  queryDescription:string='';
  message:string='';
  isDisplay:boolean=false
  


  // Toggle the display of options
  toggleOptions() {
    this.showOptions = !this.showOptions;
    this.selectedMainOption = null;
    this.solutionText = '';
    this.subOptions = []; // Reset sub-options when options are toggled

    
  }

  constructor(private queryService:SupportService) { }

  ngOnInit(): void {
  }
  selectMainOption(option: string) {
        // this.isDisplay=true;
      
    
    console.log('Selected Option:', this.selectMainOption);
    this.selectedMainOption = option;
    console.log('Selected Option:', this.selectedMainOption);


    this.showOptions = false;
    this.solutionText = '';
    // this.subOptions = [];


    // Define sub-questions based on the selected main option
    switch (option) {
      case 'Debit':
        this.subOptions = [
          { question: 'Why was my debit transaction declined?', solution: ' Your debit transaction may be declined due to insufficient funds, incorrect card details, or exceeding your daily transaction limit.' },
          { question: 'How long does it take for a debit transaction to reflect?', solution: 'Typically, debit transactions reflect instantly, but in some cases, it may take a few minutes to a few hours depending on the network or banking delays.' },
          {question:'Can I cancel a pending debit transaction?',solution:' Unfortunately, pending debit transactions cannot be canceled. You will need to wait for the transaction to complete, and then you may request a reversal if necessary.'},

        ];
        break;
      case 'Credit':
        this.subOptions = [
          { question: 'Money was sent, but the recipient didn’t receive it. What should I do?', solution: 'CVerify the recipient’s details and ensure they are correct. Check if the transaction is still pending. Contact support with the transaction ID for further assistance.' },
          { question: 'Incorrect recipient received the funds. How can I reverse the transaction?', solution: 'Once a transaction is successful, reversing it can be difficult. Immediately contact support with the transaction details. A reversal request may be possible depending on the recipient’s consent.' },
          {question:'Transferred money to a wrong account number by mistake.',solution:': If the money has been transferred to a wrong account, reach out to the recipient’s bank. Provide the wrong account details, transaction ID, and request a reversal. You may also need to file a formal dispute.'},
          {question:'The recipient cannot access the credited amount, what should they do?',solution:'The recipient should verify if any hold or restriction is placed on their account by their bank. If the issue persists, they can reach out to their bank with the transaction details.'}


        ];
        break;
      case 'Withdraw':
        this.subOptions = [
          { question: 'ATM withdrawal failure?', solution: 'Ensure funds are available and try again.' },
          { question: 'I initiated a withdrawal to my account number, but the funds have not  arrived yet.', solution: ': Withdrawals can sometimes take up to 1-2 business days to process. Ensure the account number entered is correct. If it takes longer than expected, please contact support with the transaction ID.' },
          {question:'Why was my withdrawal request rejected?',solution:'Withdrawals can be rejected for various reasons, including insufficient funds, incorrect account number, or technical issues with your bank. Check the rejection message for details or contact support for clarification.'},
          {question:'I entered my correct account number but the withdrawal is still showing as pending.',solution:'Withdrawals can sometimes take longer to process if there are system issues. If the status remains pending for more than 24 hours, reach out to support with your transaction ID.'}

        ];
        break;
      case 'Deposit':
        this.subOptions = [
          { question: 'I entered the wrong account number for a deposit. Can I recover my funds?', solution: ' Deposits may take up to 1-2 business days to reflect in your account, depending on your bank. Verify that the account number you used is correct. If the delay exceeds the expected timeframe, please contact support with your deposit reference number.' },
          { question: 'Deposit not reflected?', solution: ' If you deposited money to an incorrect account number, please contact support immediately with your deposit details. Recovery is possible only if the funds have not yet been credited to the wrong account.' },
          {question:'Can I cancel a deposit once it has been initiated?',solution:'Unfortunately, once a deposit has been initiated, it cannot be canceled. Ensure that you enter the correct account number and amount before confirming the transaction.'},

        ];
        break;
    }
  }


  
  sendTicket() {
    if (this.queryDescription.trim()) {
      const queryData = {
        ticket:this.selectedMainOption,
        description: this.queryDescription
      };

      this.queryService.sendTicket(queryData).subscribe(data => {
          this.message = 'Query sent successfully!';
          this.queryDescription = '';
          this.selectedMainOption=null;

          setTimeout(() => {
            this.isDisplay=false
          }, 3000); 
        },      
         error=> {
          this.message = 'Error sending query. Please try again.';
        });
    } else {
      this.message = 'Please enter a the description of your query.';
    }

      }

  raiseQuery(){
    this.isDisplay=true;
  }



  showSolution(subOption: any) {
    this.solutionText = subOption.solution;
  }
}