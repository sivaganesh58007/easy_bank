import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { AdminticketsService } from '../services/admintickets.service';

@Component({
  selector: 'app-admintickets',
  templateUrl: './admintickets.component.html',
  styleUrls: ['./admintickets.component.css']
})
export class AdminticketsComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatContainer') private chatContainer: ElementRef | undefined;

  tickets: any[] = [];    
  ticket_time: string | any;  
  currentUserId: string | any;
  selectedTicket: any;
  description: string | any;  
  messages: any[] = [];  
  newMessage: string = '';
  ticket_id: string = '';
  user_id: string = '';
  data = {};
  Ticketselect: any;
  user_name: string | null = null;
  private shouldScroll: boolean = false; // Flag to control auto-scrolling
  Nilltickets: boolean=false;

  constructor(private adminticketservice: AdminticketsService) { }

  ngOnInit(): void {
    this.loadTickets();
    this.currentUserId = sessionStorage.getItem('user_id');
  }

  // Called after Angular checks the component's view
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false; // Reset flag after scrolling
    }
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  loadTickets() {
    this.adminticketservice.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        // if (this.tickets.length > 0) {
        //   this.Nilltickets = false;
        //   this.selectTicket(this.tickets[0]);
        // } else {
        //   this.Nilltickets = true;
        // }
  
      },
      error => {
        console.log('Error loading tickets:', error);
      }
    );
  }

  selectTicket(ticket: any) {
    this.tickets.forEach(current_ticket => {
      if (current_ticket.ticket_id == ticket.ticket_id) {
        current_ticket.messageCount = 0;

      }
    });


    console.log('hello',ticket)
    

    this.selectedTicket = true;
    this.ticket_id = ticket.ticket_id;
    this.Ticketselect = ticket;

    this.adminticketservice.getMessages(ticket.ticket_id).subscribe(
      (data) => {
        this.description = ticket.description;

        this.messages = data.message_data;
        this.user_id = data.ticket_user_id;
        this.messages.forEach(message => {
          message.sent_at = new Date(message.sent_at).toLocaleString("en-US", {
            timeStyle: "short",
          });
        });
        this.shouldScroll = true; 
      },
      (error) => {
        console.log('Error loading messages:', error);
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messagePayload = {
        message: this.newMessage,
        ticket_id: this.ticket_id,
        user_id: this.user_id
      };

      this.adminticketservice.sendMessage(messagePayload).subscribe(
        (data) => {
          this.messages.push({
            message: this.newMessage,
            sender_id: this.currentUserId,
            sent_at: new Date().toLocaleString("en-US", {
              timeStyle: "short",
            })
          });
          this.newMessage = ''; // Clear the input field
          this.shouldScroll = true; // Trigger scroll after sending a new message
        },
        (error: any) => {
          console.log('Error sending message:', error);
        }
      );
    }
  }
}
