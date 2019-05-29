import { Component, ElementRef, OnInit, Input, OnDestroy, ViewChild,  } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadFile, uploadOptions } from './interfaces';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss']
})
export class DynamicInputComponent implements OnInit, OnDestroy {
  
  
  @Input() options: uploadOptions;

  @Input() onFileChange: (fileList: UploadFile[]) => void;

  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('multipleFileInput') multipleFileInput: ElementRef;

  
  constructor() { }

  ngOnInit() {
  }

  onClick(): void {
    if(this.options.disabled) {
      return
    }
    if (this.options.multiple) {
      (this.multipleFileInput.nativeElement as HTMLInputElement).click();
    } else {
      (this.fileInput.nativeElement as HTMLInputElement).click();
    }
  }

  onChange(event) {
    let fileList = (event.target as HTMLInputElement).files;
    const files = [];
    for (let i = 0, l = fileList.length; i < l; i++) {
      files.push(fileList[i]);
    }
    this.onFileChange(files);
  }

  onMultiFileChange(event) {
    let fileList = (event.target as HTMLInputElement).files;
    const files = [];
    for (let i = 0, l = fileList.length; i < l; i++) {
      files.push(fileList[i]);
    }
    this.onFileChange(files);
  }

  ngOnDestroy(): void {
  }
}
