import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DeviceService } from '../../../shared/service';

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

  _isMute: boolean = false;

  _playList: Array<any> = [];

  volume: number = 1;

  playedTime: number  = 0;  // seconds

  timePercent: number = 0;

  volumePercent: number = 100;

  _tempVolume: number;

  currentPlayingItem: any = null;

  isPlaying: boolean;

  constructor(
    private deviceService: DeviceService,
  ) {
    this._playList = this.playList.concat();
  }

  ngOnInit() {
  }

  mute(): void {
    if (this._isMute) {
      this.audioElement.nativeElement.volume = this._tempVolume;
    } else {
      this._tempVolume = this.audioElement.nativeElement.volume;
      this.audioElement.nativeElement.volume = 0;
    }
    this.volumePercent = this.audioElement.nativeElement.volume * 100;
    this._isMute = !this._isMute;
  }

  onTimeChange(percent): void {
    const duration = this.currentPlayingItem[this.durationKey] / 1000;
    this.setPlayTime(Math.floor(duration * percent / 100));
  }

  onVolumeChange(percent): void {
    this.audioElement.nativeElement.volume = percent / 100;
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

  pause(): void {
    this.isPlaying = false;
    this.audioElement.nativeElement.pause();
    window.clearInterval(this._interval);
  }

  getPlayedTime(): void {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this.playedTime = this.audioElement.nativeElement.currentTime;
        this.timePercent = Math.floor(this.playedTime / (this.currentPlayingItem[this.durationKey] / 1000) *100);
      }, 1000);
    }
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
