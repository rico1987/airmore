import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input() imageList: Array<any>;

  @Input() srcKey: string = 'path';

  @Input() thumbKey: string = 'thumbPath';

  @Input() widthKey: string = 'width';

  @Input() heightKey: string = 'height';

  @Input() scaleMin: number = 0.1;

  @Input() scaleMax: number = 10;

  @Input() thumbPreview: number = 1;

  @Input() thumbPreload: number = 3;

  @Input() playIntervalTime: number = 5000;

  @Input() minPlayIntervalTime: number = 3000;

  @Input() deletable: boolean = true;

  @Input() thumbCount: number = 0;

  @Input() thumbArrowWidth: number = 40;

  @Input() thumbVisible: boolean = true;

  @Input() thumbIndex: number = 0;

  @Input() isPlaying: boolean = false;

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
