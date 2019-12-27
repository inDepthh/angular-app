import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent{

  constructor() { }

  @Output() messageEvent = new EventEmitter<string>();

  @Input() x = 0;
  @Input() y = 0;
  @Input() index: number;
  @Input() pizzas: [];

  removeItem() {
    this.messageEvent.emit(this.index.toString());
  }
}