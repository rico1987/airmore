
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ModalRef } from './modal-ref.class';

interface RegisteredMeta {
    modalRef: ModalRef;
    afterOpenSubscription: Subscription;
    afterCloseSubscription: Subscription;
}

@Injectable()
export class ModalControlService {

    // Track singleton afterAllClose through over the injection tree
    get afterAllClose(): Subject<void> {
        return this.parentService ? this.parentService.afterAllClose : this.rootAfterAllClose!;
    }

    // Track singleton openModals array through over the injection tree
    get openModals(): ModalRef[] {
        return this.parentService ? this.parentService.openModals : this.rootOpenModals!;
    }

    private rootOpenModals: ModalRef[] | null = this.parentService ? null : [];
    private rootAfterAllClose: Subject<void> | null = this.parentService ? null : new Subject<void>();
    private rootRegisteredMetaMap: Map<ModalRef, RegisteredMeta> | null = this.parentService ? null : new Map();

    private get registeredMetaMap(): Map<ModalRef, RegisteredMeta> {
        // Registered modal for later usage
        return this.parentService ? this.parentService.registeredMetaMap : this.rootRegisteredMetaMap!;
    }


    constructor(@Optional() @SkipSelf() private parentService: ModalControlService) {}

    registerModal(modalRef: ModalRef): void {
        if (!this.hasRegistered(modalRef)) {
            const afterOpenSubscription = modalRef.afterOpen.subscribe(() => this.openModals.push(modalRef));
            const afterCloseSubscription = modalRef.afterClose.subscribe(() => this.removeOpenModal(modalRef));

            this.registeredMetaMap.set(modalRef, { modalRef, afterOpenSubscription, afterCloseSubscription});
        }
    }

    deregisterModal(modalRef: ModalRef): void {
        const registeredMeta = this.registeredMetaMap.get(modalRef);
        if (registeredMeta) {
          this.removeOpenModal(registeredMeta.modalRef);
          registeredMeta.afterOpenSubscription.unsubscribe();
          registeredMeta.afterCloseSubscription.unsubscribe();
          this.registeredMetaMap.delete(modalRef);
        }
      }
    

    hasRegistered(modalRef: ModalRef): boolean {
        return this.registeredMetaMap.has(modalRef);
    }

    closeAll(): void {
        let i = this.openModals.length;
        
        while (i--) {
            this.openModals[i].close();
        }
    }

    private removeOpenModal(modalRef: ModalRef): void {
        const index = this.openModals.indexOf(modalRef);

        if (index > -1) {
            this.openModals.splice(index, 1);

            if (!this.openModals.length) {
                this.afterAllClose.next();
            }
        }
    }

}