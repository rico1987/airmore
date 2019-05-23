import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';

export abstract class ModalRef<T = any, R = any> {

  abstract afterOpen: Observable<void>;
  
  abstract afterClose: Observable<R>;

  abstract open(): void;
  abstract close(result?: R): void;
  abstract destroy(result?: R): void;

  abstract triggerOk(): void;
  abstract triggerCancel(): void;

  abstract getContentComponent(): T;

  /**
   * Get the dom element of this Modal
   */
  abstract getElement(): HTMLElement;

  /**
   * Get the instance of the Modal itself
   */
  abstract getInstance(): ModalComponent;
}