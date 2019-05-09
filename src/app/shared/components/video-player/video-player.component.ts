import { Component, ElementRef, OnInit, Input, OnDestroy, ViewChild,  } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  @Input() videoSrc: string;

  @Input() title: string;

  @Input() onClose: Function;

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.onClose();
  }

}
