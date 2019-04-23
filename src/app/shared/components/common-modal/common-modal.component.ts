import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent implements OnInit {

  @Input() type: 'modal' | 'confirm' | 'success' | 'info' | 'warning' | 'error' | '' = 'modal';

  @Input() showTitle: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
