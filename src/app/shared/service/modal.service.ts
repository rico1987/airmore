import {Injectable, TemplateRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from '../components/common-alert/common-alert.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(private modalService: NgbModal) {}

    alert(content: string, title: string): void {
        this.modalService.open(CommonAlertComponent);
    }

    confirm(template: string | TemplateRef<any>, options ?: NgbModalOptions): Promise<any> {
        return this.modalService.open(template, options).result;
    }

    modal(): void {}
}