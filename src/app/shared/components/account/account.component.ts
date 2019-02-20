import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private appStateService: AppStateService) { }

  ngOnInit() {
  }

}
