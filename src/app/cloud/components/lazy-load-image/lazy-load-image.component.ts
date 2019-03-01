import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lazy-load-image',
  templateUrl: './lazy-load-image.component.html',
  styleUrls: ['./lazy-load-image.component.scss']
})
export class LazyLoadImageComponent implements OnInit {

  @Input() imgSrc: string;

  isLoaded = false;

  constructor() { }

  ngOnInit() {
    const image = document.createElement('img');
    image.setAttribute('src', this.imgSrc);
    const timer = setInterval(() => {
      if (image.complete) {
        // this.isLoaded = true;
        clearInterval(timer);
      }
    }, 50);
  }

}
