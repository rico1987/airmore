import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DeviceService } from '../../../shared/service/device.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  @ViewChild('audioElement') audioElement: ElementRef;

  @Input() playList: Array<any> = [];

  @Input() uniqueKey: string = 'ID';

  @Input() srcKey: string = 'Path';

  @Input() isDevice: boolean = true;

  @Input() durationKey: string = 'Duration';

  @Input() displayTitleKey: string = 'ShowName';

  @Input() coverKey: string = 'cover';

  @Input() playMode: 'order' | 'only' | 'random' = 'order';

  _interval: any;

  _playList: Array<any> = [];

  volume: number = 1;

  playedTime: number  = 0;  // seconds

  currentPlayingItem: any = null;

  isPlaying: boolean;

  constructor(
    private deviceService: DeviceService,
  ) {
    this._playList = this.playList.concat();
  }

  ngOnInit() {
  }

  playMusic(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    this.isPlaying = true;
    if (!this.currentPlayingItem) {
      this.currentPlayingItem = this.playList[0];
    }
    this.audioElement.nativeElement.src = this._getSourceAddress(this.currentPlayingItem[this.srcKey]);
    this.audioElement.nativeElement.play();
    this.getPlayedTime();
  }

  getPlayedTime(): void {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this.playedTime = this.audioElement.nativeElement.currentTime;
      }, 1000);
    }
  }

  pause(): void {
    this.isPlaying = false;
    this.audioElement.nativeElement.pause();
    window.clearInterval(this._interval);
    clearInterval(this._interval);
  }

  next(): void {
    if (this.playMode === 'order') {
      const index = this.playList.findIndex((ele) => ele[this.uniqueKey] === this.currentPlayingItem[this.uniqueKey]);
      if (index < this.playList.length - 1) {
        this.currentPlayingItem = this.playList[index + 1];
      } else {
        this.currentPlayingItem = this.playList[0];
      }
    } else if (this.playMode === 'random') {

    }
    this.setPlayTime(0);
    this.play();
  }

  prev(): void {
    if (this.playMode === 'order') {
      const index = this.playList.findIndex((ele) => ele[this.uniqueKey] === this.currentPlayingItem[this.uniqueKey]);
      if (index > 0) {
        this.currentPlayingItem = this.playList[index - 1];
      } else {
        this.currentPlayingItem = this.playList[this.playList.length - 1];
      }
    } else if (this.playMode === 'random') {

    }
    this.setPlayTime(0);
    this.play();
  }

  setTime(event): void {
    console.log(event);
  }

  setCurrentPlayingItem(item: any): void {
    this.currentPlayingItem = item;
  }

  setPlayList(playList: Array<any>): void {
    this.playList = playList;
  }

  setPlayTime(time: number): void {
    this.playedTime = time;
    this.audioElement.nativeElement.currentTime = time;
  }

  switchMode(): void {
    const modes: Array<'order' | 'only' | 'random'> = ['order' , 'only' , 'random'];
    this.playMode = modes[(modes.findIndex((ele) => ele === this.playMode) + 1) % 3];
    console.log(this.playMode);
  }

  private _getSourceAddress(src: string): string {
    return this.isDevice ? this.deviceService.resolvePath(src) : src;
  }

  get _playSliderWidth() {
    if (this.currentPlayingItem && this.currentPlayingItem[this.durationKey]) {
      return Math.floor(this.playedTime / (this.currentPlayingItem[this.durationKey] / 1000) * 100) + '%';
    } else {
      return 0;
    }
  }
}
