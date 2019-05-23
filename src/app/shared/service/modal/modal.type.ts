import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter, TemplateRef, Type } from '@angular/core';

export type OnClickCallback<T> = (instance: T) => (false | void | {}) | Promise<false | void | {}>;

export type ModalType = 'default' | 'confirm'; // Different modal styles we have supported

export type ConfirmType = 'confirm' | 'info' | 'success' | 'error' | 'warning'; // Subtypes of Confirm Modal

export interface ModalOptions<T = any, R = any> {
  amModalType?: ModalType;
  amVisible?: boolean;
  amZIndex?: number;
  amWidth?: number | string;
  amWrapClassName?: string;
  amClassName?: string;
  amStyle?: object;
  amIconType?: string; // Confirm Modal ONLY
  amTitle?: string | TemplateRef<{}>;
  amContent?: string | TemplateRef<{}> | Type<T>;
  amComponentParams?: Partial<T>;
  amClosable?: boolean;
  amKeyboard?: boolean;
  amMask?: boolean;
  amMaskClosable?: boolean;
  amMaskStyle?: object;
  amBodyStyle?: object;
  amFooter?: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null; // Default Modal ONLY
  amGetContainer?: HTMLElement | OverlayRef | (() => HTMLElement | OverlayRef); // STATIC
  amAfterOpen?: EventEmitter<void>;
  amAfterClose?: EventEmitter<R>;

  // --- Predefined OK & Cancel buttons
  amOkText?: string | null;
  amOkType?: string;
  amOkLoading?: boolean;
  amOkDisabled?: boolean;
  amCancelDisabled?: boolean;
  amOnOk?: EventEmitter<T> | OnClickCallback<T>; // Mixed using ng's Input/Output (Should care of "this" when using OnClickCallback)
  amCancelText?: string | null;
  amCancelLoading?: boolean;
  amNoAnimation?: boolean;
  amOnCancel?: EventEmitter<T> | OnClickCallback<T>; // Mixed using ng's Input/Output (Should care of "this" when using OnClickCallback)
}

export interface ModalOptionsForService<T = any> extends ModalOptions<T> {
  // Limitations for using by service
  amOnOk?: OnClickCallback<T>;
  amOnCancel?: OnClickCallback<T>;
}

export interface ModalButtonOptions<T = any> {
  label: string;
  type?: string;
  shape?: string;
  ghost?: boolean;
  size?: string;
  autoLoading?: boolean; // Default: true, indicate whether show loading automatically while onClick returned a Promise

  // [NOTE] "componentInstance" will refer to the component's instance when using Component
  show?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  loading?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean); // This prop CAN'T use with autoLoading=true
  disabled?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  onClick?(this: ModalButtonOptions<T>, contentComponentInstance?: T): (void | {}) | Promise<void | {}>;

  [key: string]: any;
}
