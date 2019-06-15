import { Component, OnInit } from '@angular/core';
const adds = require('../../../config/adds');
import { AppService } from '../../service/app.service';

@Component({
  selector: 'app-tool-modal',
  templateUrl: './tool-modal.component.html',
  styleUrls: ['./tool-modal.component.scss']
})
export class ToolModalComponent implements OnInit {

  private _products: Array<any> = [];
  public get products(): Array<any> {
    return this._products;
  }
  public set products(value: Array<any>) {
    this._products = value;
  }

  constructor(
    private appService: AppService,
  ) {
    this.products = adds.adds.getProducts(this.appService.currentLanguage);
    console.log(this.products);
  }

  ngOnInit() {
  }

}
