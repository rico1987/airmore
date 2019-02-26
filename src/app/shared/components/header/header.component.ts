import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private appStateService: AppStateService) { }

  ngOnInit() {
  }

  setActiveViewMode(viewMode: 'list' | 'grid'): void {
    this.appStateService.setActiveViewMode(viewMode);
  }
}
