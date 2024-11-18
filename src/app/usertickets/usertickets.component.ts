import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { UserticketsService } from '../services/usertickets.service';

@Component({
  selector: 'app-usertickets',
  templateUrl: './usertickets.component.html',
  styleUrls: ['./usertickets.component.css']
})
export class UserticketsComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer: ElementRef | undefined;

  tickets: any[] = [];   
  selectedTicket: any;
  description: string | any; 
  status: string | any; 
  ticket_time: string | any;   
  messages: any[] = [];   
  newMessage: string = '';
  currentUserId: string | null = null; 
  ticket_id: string = '';
  Ticketselect: any;
  ticket: any;
  Nilltickets:boolean=false
  private shouldScroll: boolean = false; // Flag to control auto-scrolling
  

  constructor(private userticketService: UserticketsService) { }

  ngOnInit(): void {
    this.loadTickets();
    this.currentUserId = sessionStorage.getItem('user_id');
  }

  // Called after Angular checks the component's view
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false; // Reset flag
    }
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  loadTickets() {
    this.userticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data; 
        console.log(this.tickets)
        if(this.tickets.length==0){
            this.Nilltickets=true
        }
        
      },
      error => {
        console.log('Error loading tickets:', error);
      }
    );
  }

  selectTicket(ticket: any) {
    this.tickets.forEach(current_ticket => {
      if (current_ticket.ticket_id === ticket.ticket_id) {
        current_ticket.messagesCount = 0;
      }
    });
    this.selectedTicket = true;
    this.Ticketselect = ticket;
    this.ticket_id = ticket.ticket_id;
    this.userticketService.getMessages(ticket.ticket_id).subscribe(
      (data) => {
        this.description = ticket.description;
        this.messages = data.message_data;
        this.messages.forEach(message => {
          message.sent_at = new Date(message.sent_at).toLocaleString("en-US", { timeStyle: "short" });
        });
        this.shouldScroll = true; // Trigger scroll after loading messages
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
        ticket_id: this.ticket_id
      };
      this.userticketService.sendMessage(messagePayload).subscribe(
        (data) => {
          this.messages.push({
            message: this.newMessage,
            sender_id: this.currentUserId,
            sent_at: new Date().toLocaleString("en-US", { timeStyle: "short" })
          });
          this.newMessage = ''; 
          this.shouldScroll = true; 
        },
        (error: any) => {
          console.log('Error sending message:', error);
        }
      );
    }
  }
}
