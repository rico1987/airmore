import { Component, OnInit, Input } from '@angular/core';
import { ANIMATIONS } from '../../../shared/animations';

@Component({
  selector: 'app-lazy-load-image',
  templateUrl: './lazy-load-image.component.html',
  styleUrls: ['./lazy-load-image.component.scss'],
  animations: ANIMATIONS,
})
export class LazyLoadImageComponent implements OnInit {

  @Input()
  get imgSrc(): string { return this._imgSrc; }
  set imgSrc(imgSrc: string) { this._imgSrc = imgSrc; }
  private _imgSrc: string;

  isLoaded = false;

  constructor() { }

  ngOnInit() {
    const image = document.createElement('img');
    image.setAttribute('src', this.imgSrc);
    const timer = setInterval(() => {
      if (image.complete) {
        this.isLoaded = true;
        clearInterval(timer);
      }
    }, 50);
  }

}
