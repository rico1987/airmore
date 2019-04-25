import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input() imageList: Array<any>;

  @Input() srcKey = 'path';

  @Input() thumbKey = 'thumbPath';

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

  @Input() thumbIndex = 0;

  @Input() isPlaying = false;

  private _thumbList: Array<any> = [];

  private _activeThumb: any;

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
  }

  doAction(action: string): void {
    console.log(action);
  }

}
