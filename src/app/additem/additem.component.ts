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
  text = 'Add';

  @Output() messageEvent = new EventEmitter<string>();

  constructor(public databaseService: DatabaseService) { }

  ngOnInit() { 
    console.log(this.databaseService.getEditStatus());
    if (this.databaseService.getEditStatus()) {
      console.log("called edit");
      this.text = 'Edit';
    }
  }

  getText() {
    return this.text;
  }

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
    // send post
    if (this.ifNameAndPrice() && this.ifEditStatus()) {
      this.messageEvent.emit(this.name)
      this.messageEvent.emit(this.price)
      this.messageEvent.emit(this.itemType)
    } else if (!this.databaseService.getEditStatus()) {
      console.log("alert 1: edit status: " + this.databaseService.getEditStatus());
      alert('Error: All Fields are Required');
      return;
    }

    // send update 
    if (this.ifNameAndPrice() && this.databaseService.getEditStatus()) {
      this.messageEvent.emit(this.name)
      this.messageEvent.emit(this.price)
      this.databaseService.onUpdate(this.databaseService.getIndex(), this.databaseService.getItemType(), this.name, this.price);
      this.databaseService.setEditStatus(false);
    } else if (this.databaseService.getEditStatus()) {
      console.log("alert 2");
      alert('Error: All Fields are Required');
      return;
    }
  }

  ifEditStatus() {
    return this.itemType != null && !this.databaseService.getEditStatus()
  }

  ifNameAndPrice() {
    return this.name != null && this.price != null
  }

  dismissDialogMessage() {
    if (this.databaseService.getEditStatus()) {
      this.databaseService.setEditStatus(false);
    }
    this.messageEvent.emit('dismiss');
  }
}