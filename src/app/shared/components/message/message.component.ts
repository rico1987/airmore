import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: string;

  @Input() type: string;

  @Input() zindex: number;

  constructor() { }

  ngOnInit() {
  }

}
