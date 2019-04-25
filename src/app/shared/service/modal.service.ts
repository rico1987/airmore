import {Injectable, TemplateRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../components/common-modal/common-modal.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(private modalService: NgbModal) {}

    success(content: string, title: string): void {
        const modalRef = this.modalService.open(CommonModalComponent);
        modalRef.componentInstance.type = 'success';
        modalRef.componentInstance.content = content;
        modalRef.componentInstance.title = title || 'Success';
    }

    info(content: string, title: string): void {
        const modalRef = this.modalService.open(CommonModalComponent);
        modalRef.componentInstance.type = 'info';
        modalRef.componentInstance.content = content;
        modalRef.componentInstance.title = title || 'Info';
    }

    warn(content: string, title: string): void {
        const modalRef = this.modalService.open(CommonModalComponent);
        modalRef.componentInstance.type = 'warn';
        modalRef.componentInstance.content = content;
        modalRef.componentInstance.title = title || 'Warning';
    }

    error(content: string, title: string): void {
        const modalRef = this.modalService.open(CommonModalComponent);
        modalRef.componentInstance.type = 'error';
        modalRef.componentInstance.content = content;
        modalRef.componentInstance.title = title || 'Error';
    }

    confirm(template: string | TemplateRef<any>, options ?: NgbModalOptions): Promise<any> {
        return this.modalService.open(template, options).result;
    }

    modal(template: string | TemplateRef<any>, options ?: NgbModalOptions): Promise<any> {
        return this.modalService.open(template, options).result;
    }

}
