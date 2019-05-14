import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: any;

  isEdit: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  edit(): void {
    if (this.isEdit) {
      this.save();
    }
    this.isEdit = !this.isEdit;
    console.log(this.isEdit);
  }

  save(): void {}

  updatePortrait(): void {}

  deletePortrait(): void {}
}
