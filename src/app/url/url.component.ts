import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent  {
  apiUrl: string = 'http://127.0.0.1:5000';
  constructor() { }


  
}
