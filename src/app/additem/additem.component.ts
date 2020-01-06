import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  name: string;
  price: string;
  itemTypes = ['Pizza', 'Side', 'Drink']
  itemType: string;

  @Output() messageEvent = new EventEmitter<string>();

  constructor(public databaseService: DatabaseService) { }

  ngOnInit() { }

  addName(event: any) {
    this.name = event.target.value;
  }

  addPrice(event: any) {
    this.price = event.target.value;
  }

  changeListType(event: any) {
    this.itemType = event.target.value;
  }

  sendMessage(event: any) {
    if (this.databaseService.getEditStatus) {
      console.log("called edit");
    }

    if (this.name != null && this.price != null && this.itemType != null) {
      this.messageEvent.emit(this.name)
      this.messageEvent.emit(this.price)
      this.messageEvent.emit(this.itemType);
    } else {
      alert('Error: All Fields are Required');
    }
  }

  dismissDialogMessage() {
    this.messageEvent.emit('dismiss');
  }
}
