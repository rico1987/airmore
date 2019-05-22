import { Component, OnInit } from '@angular/core';
import { CloudStateService } from '../../../shared/service';

@Component({
  selector: 'app-cloud-navigator',
  templateUrl: './cloud-navigator.component.html',
  styleUrls: ['./cloud-navigator.component.scss']
})
export class CloudNavigatorComponent implements OnInit {

  constructor(
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
  }

  moveUp(): void {
    this.cloudStateService.moveUp();
  }

  changeParent(parent: any): void {
    this.cloudStateService.changeParent(parent);
  }

}
