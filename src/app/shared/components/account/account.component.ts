import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(
    private router: Router,
    private appService: AppService,
  ) { }

  ngOnInit() {
  }

  returnToCloud(): void {
    this.appService.hideConnection();
    this.appService.setCurrentModule('cloud');
    this.router.navigate(
      ['cloud']
    );
  }

  switchAccount(): void {
    this.appService.accountRoute = 'passwordLogin';
  }
}
