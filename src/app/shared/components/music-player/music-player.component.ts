import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  currentPlayingItem: any = null;

  playList: Array<any>;

  constructor() { }

  ngOnInit() {
  }

  play(): void {}

  pause(): void {}

  next(): void {}

  prev(): void {}

}
