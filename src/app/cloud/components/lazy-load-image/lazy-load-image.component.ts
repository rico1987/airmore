import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lazy-load-image',
  templateUrl: './lazy-load-image.component.html',
  styleUrls: ['./lazy-load-image.component.scss']
})
export class LazyLoadImageComponent implements OnInit {

  @Input() imgSrc: string;

  isLoaded: false;

  constructor() { }

  ngOnInit() {
    console.log('aaaa');
  }

}
