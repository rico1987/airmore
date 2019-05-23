import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from '../logger.service';
import { ModalControlService } from './modal-control.service';
import { ModalRef } from './modal-ref.class';
import { ConfirmType, ModalOptions, ModalOptionsForService } from './modal.type';
import { ModalComponent } from './modal.component';

export class ModalBuilderForService {
    private modalRef: ComponentRef<ModalComponent> | null;
    private overlayRef: OverlayRef;
    
    constructor(private overlay: Overlay, options: ModalOptionsForService = {}) {
        this.createModal();
        if (!('amGetContainer' in options)) {
            // As we use CDK to create modal in service by force, there is no need to use amGetContainer
            options.amGetContainer = undefined; // Override amGetContainer's default value to prevent creating another overlay
        }

        this.changeProps(options);
        this.modalRef!.instance.open();
        this.modalRef!.instance.amAfterClose.subscribe(() => this.destroyModal()); // [NOTE] By default, close equals destroy when using as Service
    }

    getInstance(): ModalComponent | null {
        return this.modalRef && this.modalRef.instance;
    }

    destroyModal(): void {
        if (this.modalRef) {
          this.overlayRef.dispose();
          this.modalRef = null;
        }
    }

    private changeProps(options: ModalOptions): void {
        if (this.modalRef) {
          Object.assign(this.modalRef.instance, options); // DANGER: here not limit user's inputs at runtime
        }
    }

    private createModal(): void {
        this.overlayRef = this.overlay.create();
        this.modalRef = this.overlayRef.attach(new ComponentPortal(ModalComponent));
    }
}

@Injectable()
export class ModalService {

    constructor(private overlay: Overlay, private logger: Logger, private modalControl: ModalControlService) {}

    closeAll(): void {
        this.modalControl.closeAll();
    }

    create<T>(options: ModalOptionsForService<T> = {}): ModalRef<T> {
        if (typeof options.amOnCancel !== 'function') {
            options.amOnCancel = () => {};
        }
        const modalRef = new ModalBuilderForService(this.overlay, options).getInstance();
        
        return modalRef;
    }

    confirm<T>(options: ModalOptionsForService<T> = {}, confirmType: ConfirmType = 'confirm'): ModalRef<T> {
        if ('amFooter' in options) {
          this.logger.warn(`The Confirm-Modal doesn't support "amFooter", this property will be ignored.`);
        }
        if (!('amWidth' in options)) {
          options.amWidth = 416;
        }
        if (typeof options.amOnOk !== 'function') {
          // NOTE: only support function currently by calling confirm()
          options.amOnOk = () => {}; // Leave a empty function to close this modal by default
        }
    
        options.amModalType = 'confirm';
        options.amClassName = `airmore-modal-confirm airmore-modal-confirm-${confirmType} ${options.amClassName || ''}`;
        options.amMaskClosable = false;
        return this.create(options);
    }

    info<T>(options: ModalOptionsForService<T> = {}): ModalRef<T> {
        return this.simpleConfirm(options, 'info');
    }

    success<T>(options: ModalOptionsForService<T> = {}): ModalRef<T> {
        return this.simpleConfirm(options, 'success');
    }

    error<T>(options: ModalOptionsForService<T> = {}): ModalRef<T> {
        return this.simpleConfirm(options, 'error');
    }

    warning<T>(options: ModalOptionsForService<T> = {}): ModalRef<T> {
        return this.simpleConfirm(options, 'warning');
    }

    private simpleConfirm<T>(options: ModalOptionsForService<T> = {}, confirmType: ConfirmType): ModalRef<T> {
        const iconMap = {
          info: 'info-circle',
          success: 'check-circle',
          error: 'close-circle',
          warning: 'exclamation-circle'
        };
        if (!('amIconType' in options)) {
          options.amIconType = iconMap[confirmType];
        }
        if (!('amCancelText' in options)) {
          // Remove the Cancel button if the user not specify a Cancel button
          options.amCancelText = null;
        }
        return this.confirm(options, confirmType);
    }

    get openModals(): ModalRef[] {
        return this.modalControl.openModals;
    }

    get afterAllClose(): Observable<void> {
        return this.modalControl.afterAllClose.asObservable();
    }
}