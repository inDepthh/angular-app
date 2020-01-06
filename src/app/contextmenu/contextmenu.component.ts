import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuStatus } from '../menu-status.enum';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent{

  constructor(public databaseService: DatabaseService) { }

  @Output() messageEvent = new EventEmitter<string>();

  @Input() x = 0;
  @Input() y = 0;
  @Input() index: number;

  sendMessageEdit() {
    this.databaseService.dataReciever(true);
    this.messageEvent.emit(this.index.toString());
  }

  sendMessageDelete() {
    this.messageEvent.emit(this.index.toString());
  }
}
