import { Component, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import { ANIMATIONS } from '../../../shared/animations';

@Component({
  selector: 'app-lazy-load-image',
  templateUrl: './lazy-load-image.component.html',
  styleUrls: ['./lazy-load-image.component.scss'],
  animations: ANIMATIONS,
})
export class LazyLoadImageComponent implements OnInit {

  @Input() imgSrc: string;

  @Output() onLoaded = new EventEmitter<any>();

  @Input() autoSize: boolean = false;

  @Input() lazy: boolean = false;

  @Input() shouldLoad: boolean = false;

  private _isLoaded = false;

  private _hasLoading = false;

  constructor(
  ) { }

  ngOnInit() {
    if (!this.lazy) {
      this.loadImage();
    }
  }

  private loadImage(): void {
    if (!this._hasLoading) {
      this._hasLoading = true;
      const image = document.createElement('img');
      image.setAttribute('src', this.imgSrc);
      const timer = setInterval(() => {
        if (image.complete) {
          this._isLoaded = true;
          this.onLoaded.emit();
          clearInterval(timer);
        }
      }, 50);
    }
  }

  get isLoaded(): boolean {
    if (this.shouldLoad) {
      this.loadImage();
    }
    if (this.lazy) {
      return this.shouldLoad && this._isLoaded;
    } else {
      return this._isLoaded;
    }
  }
}
