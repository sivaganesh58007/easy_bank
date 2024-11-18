import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-http',
  templateUrl: './http.component.html',
  styleUrls: ['./http.component.css']
})
export class HttpComponent {
  users: any[] = [];  // Initialize as an array

  constructor(private http: HttpClient) { }

  getData(){
    this.http.get(`http://127.0.0.1:5000/getdetails`)

      .subscribe((data: any) => {
        this.users = data.users;  // Access the users array from the response
      });
  }
}