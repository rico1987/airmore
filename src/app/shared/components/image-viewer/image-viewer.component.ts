import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input() uniqueKey = 'resource_id';

  @Input() imageList: Array<any>;

  @Input() srcKey = 'path';

  @Input() thumbKey = 'thumbPath';

  @Input() thumbWidth: number = 64;

  @Input() widthKey = 'width';

  @Input() heightKey = 'height';

  @Input() scaleMin = 0.1;

  @Input() scaleMax = 10;

  @Input() thumbPreview = 1;

  @Input() thumbPreload = 3;

  @Input() playIntervalTime = 5000;

  @Input() minPlayIntervalTime = 3000;

  @Input() deletable = true;

  @Input() thumbCount = 0;

  @Input() thumbArrowWidth = 40;

  @Input() thumbVisible = true;

  @Input() currentDisplayIndex;

  @Input() isPlaying = false;

  @Input() onClose: any;

  @ViewChild('body') body: ElementRef;

  private _imageScale: number = 1;

  private _imageWrapperWidth: number;

  private _imageWrapperHeight: number;

  private _imageWrapperLeft: number = 0;

  private _imageWrapperTop: number = 0;

  private _currentDisplayItem: any;

  private _thumbbarBodyWidth: number = 64;
  
  private _thumbbarBodyWrapperWidth: number = 0;

  private _thumbbarBodyWrapperLeft: number = 0;

  private _maxThumbCount: number;

  private _thumbList: Array<any> = [];

  private _activeThumb: any;

  private _bodyWidth: number;

  private _bodyHeight: number;

  private _actions = [
      {
        class: 'zoomin',
        action: 'zoomin',
      },
      {
        class: 'zoomout',
        action: 'zoomout',
      },
      {
        class: 'size-contain',
        action: 'size-contain',
      },
      {
        class: 'setbg',
        action: 'setbg',
      },
      {
        class: 'prev',
        action: 'prev',
      },
      {
        class: 'play',
        action: 'play',
      },
      {
        class: 'next',
        action: 'next',
      },
      {
        class: 'rotateLeft',
        action: 'rotateLeft',
      },
      {
        class: 'rotateRight',
        action: 'rotateRight',
      },
      {
        class: 'download',
        action: 'download',
      },
      {
        class: 'delete',
        action: 'delete',
      }
  ];

  constructor() { }

  ngOnInit() {
    this.generateThumbList();
    this.currentDisplayIndex = this.currentDisplayIndex ? this.currentDisplayIndex : 0;
    this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
    this._activeThumb = this.currentDisplayIndex ? this._thumbList[this.currentDisplayIndex] : this._thumbList[0];
    this.adjust();
  }

  onWindowResize(): void {
    this.adjustBody();
  }

  doAction(action: string): void {
    console.log(action);
  }

  prev(isThumbBarScroll: boolean): void {
    if (this.currentDisplayIndex === 0) {
      this.currentDisplayIndex = this.imageList.length - 1;
      this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
    } else {
      this.currentDisplayIndex -= 1;
      this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
      this.adjustThumb('left');
    }
    
  }

  next(isThumbBarScroll: boolean): void {
    if (this.currentDisplayIndex === this.imageList.length - 1) {
      this.currentDisplayIndex = 0;
      this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
    } else {
      this.currentDisplayIndex += 1;
      this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
      this.adjustThumb('right');
    }
    
  }

  play(): void {}

  close(): void {
    this.onClose();
  }

  generateThumbList(): void {
    for (let i = 0, l = this.imageList.length; i < l ; i++) {
      this._thumbList.push({
        thumb_url: this.imageList[i][this.thumbKey],
        unique_id: this.imageList[i][this.uniqueKey],
      })
    }
  }

  setActive(thumb): void {
    const key = thumb.unique_id;
    this.currentDisplayIndex = this.imageList.findIndex((ele) => ele[this.uniqueKey] === key);
    this._currentDisplayItem = this.imageList[this.currentDisplayIndex];
    this.adjustThumb();
  }


  adjust(): void {
    this.adjustBody();
    this.adjustImage();
    this.adjustThumb();
  }

  adjustThumb(direction?: 'left' | 'right'): void {
    this.thumbCount = Math.floor((this._bodyWidth - this.thumbWidth * 2) / this.thumbWidth);
    this._maxThumbCount = Math.min(this.thumbCount, this.imageList.length);
    this._thumbbarBodyWrapperWidth = this.thumbWidth * this.imageList.length;
    this._thumbbarBodyWidth = this.thumbWidth * this._maxThumbCount;
    if (direction) {
      if (direction === 'left') {
        if (
          Math.abs(this._thumbbarBodyWrapperLeft) > (this.currentDisplayIndex - this.thumbPreload) * this.thumbWidth
        ) {
          this._thumbbarBodyWrapperLeft = Math.min(-(this.currentDisplayIndex - this.thumbPreload) * this.thumbWidth, 0);
        }
      } else if (direction === 'right') {
        if (
          Math.abs(this._thumbbarBodyWrapperLeft) < (this.currentDisplayIndex + this.thumbPreload) * this.thumbWidth - this._thumbbarBodyWidth
        ) {
          this._thumbbarBodyWrapperLeft = -Math.min(this.imageList.length * this.thumbWidth - this._thumbbarBodyWidth, (this.currentDisplayIndex + this.thumbPreload) * this.thumbWidth - this._thumbbarBodyWidth);
          console.log(this._thumbbarBodyWrapperLeft);
        }
      }
    }
  }

  adjustImage(): void {
    if (this._currentDisplayItem) {
      const width = this._currentDisplayItem[this.widthKey];
      const height = this._currentDisplayItem[this.heightKey];
      this._imageWrapperWidth = width || Math.min(this._bodyWidth, this._bodyHeight);
      this._imageWrapperHeight = height || Math.min(this._bodyWidth, this._bodyHeight);
      this._imageWrapperLeft = (this._bodyWidth - this._imageWrapperWidth) / 2;
      this._imageWrapperTop = (this._bodyHeight - this._imageWrapperHeight) / 2;
      this.adjustScale();
    }
  }

  adjustScale(): void {
    let scale: number;
    if (this._imageWrapperWidth > this._bodyWidth) {
      scale = this._bodyWidth / this._imageWrapperWidth;
    }
    if (this._imageWrapperHeight * scale > this._bodyHeight) {
      scale = this._bodyHeight / this._imageWrapperHeight;
    }
    this._imageScale = scale;
  }

  adjustBody(): void {
    this._bodyWidth = this.body.nativeElement.offsetWidth;
    this._bodyHeight = this.body.nativeElement.offsetHeight;
  }
}
