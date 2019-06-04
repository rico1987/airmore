import { Component, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';
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

  @Output() onLoaded = new EventEmitter<any>();

  @Input() isLazyLoad: boolean = false;

  @Input() autoSize: boolean = false;

  private _imgSrc: string;

  isLoaded = false;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (!this.isLazyLoad) {
      const image = document.createElement('img');
      image.setAttribute('src', this.imgSrc);
      const timer = setInterval(() => {
        if (image.complete) {
          this.isLoaded = true;
          this.onLoaded.emit();
          clearInterval(timer);
        }
      }, 50);
    }
  }

  get isInsideView(): boolean {
    const ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
    return true;
  }

}
