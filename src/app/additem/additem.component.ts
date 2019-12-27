import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  name: string;
  price: string;

  @Output() messageEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addName(event: any) {
    this.name = event.target.value;
  }

  addPrice(event: any) {
    this.price = event.target.value;
  }

  sendMessage() {
    this.messageEvent.emit(this.name)
    this.messageEvent.emit(this.price)
  }


}
