import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';

import { ESCAPE } from '@angular/cdk/keycodes';
import { BlockScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { getElementOffset, isPromise, InputBoolean } from 'ng-zorro-antd/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';

import { ModalConfig, MODAL_CONFIG } from './modal-config';
import { ModalControlService } from './modal-control.service';
import { ModalRef } from './modal-ref.class';
import { ModalButtonOptions, ModalOptions, ModalType, OnClickCallback } from './modal.type';

export const MODAL_ANIMATE_DURATION = 200; // Duration when perform animations (ms)

type AnimationState = 'enter' | 'leave' | null;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ModalComponent<T = any, R = any> extends ModalRef<T, R>
  implements OnInit, OnChanges, AfterViewInit, OnDestroy, ModalOptions<T> {

  @Input() @InputBoolean() amVisible: boolean = false;
  @Input() @InputBoolean() amClosable: boolean = true;
  @Input() @InputBoolean() amOkLoading: boolean = false;
  @Input() @InputBoolean() amOkDisabled: boolean = false;
  @Input() @InputBoolean() amCancelDisabled: boolean = false;
  @Input() @InputBoolean() amCancelLoading: boolean = false;
  @Input() @InputBoolean() amKeyboard: boolean = true;
  @Input() @InputBoolean() amNoAnimation = false;
  @Input() @InputBoolean() amMask: boolean;
  @Input() @InputBoolean() amMaskClosable: boolean;
  @Input() amContent: string | TemplateRef<{}> | Type<T>; // [STATIC] If not specified, will use <ng-content>
  @Input() amComponentParams: T; // [STATIC] ONLY avaliable when amContent is a component
  @Input() amFooter: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null; // [STATIC] Default Modal ONLY
  @Input() amGetContainer: HTMLElement | OverlayRef | (() => HTMLElement | OverlayRef) = () => this.overlay.create(); // [STATIC]
  @Input() amZIndex: number = 1000;
  @Input() amWidth: number | string = 520;
  @Input() amWrapClassName: string;
  @Input() amClassName: string;
  @Input() amStyle: object;
  @Input() amTitle: string | TemplateRef<{}>;
  @Input() amMaskStyle: object;
  @Input() amBodyStyle: object;
  @Input() amOkText: string | null;
  @Input() amCancelText: string | null;
  @Input() amOkType = 'primary';
  @Input() amIconType: string = 'exclamation-circle'; // Confirm Modal ONLY
  @Input() amModalType: ModalType = 'default';

  @Input() @Output() readonly amOnOk: EventEmitter<T> | OnClickCallback<T> = new EventEmitter<T>();
  @Input() @Output() readonly amOnCancel: EventEmitter<T> | OnClickCallback<T> = new EventEmitter<T>();

  @Output() readonly amAfterOpen = new EventEmitter<void>(); // Trigger when modal open(visible) after animations
  @Output() readonly amAfterClose = new EventEmitter<R>(); // Trigger when modal leave-animation over
  @Output() readonly amVisibleChange = new EventEmitter<boolean>();

  @ViewChild('modalContainer') modalContainer: ElementRef;
  @ViewChild('bodyContainer', { read: ViewContainerRef }) bodyContainer: ViewContainerRef;
  @ViewChild('autoFocusButtonOk', { read: ElementRef }) autoFocusButtonOk: ElementRef; // Only aim to focus the ok button that needs to be auto focused
  
  get afterOpen(): Observable<void> {
    // Observable alias for amAfterOpen
    return this.amAfterOpen.asObservable();
  }

  get afterClose(): Observable<R> {
    // Observable alias for amAfterClose
    return this.amAfterClose.asObservable();
  }

  get cancelText(): string {
    return this.amCancelText || this.locale.cancelText!;
  }

  get okText(): string {
    return this.amOkText || this.locale.okText!;
  }

  get hidden(): boolean {
    return !this.amVisible && !this.animationState;
  } // Indicate whether this dialog should hidden

  /**
   * @description
   * The calculated highest weight of mask value
   *
   * Weight of different mask input:
   * component default value < global configuration < component input value
   */
  get mask(): boolean {
    if (this.amMask != null) {
      return this.amMask;
    } else if (this.amModalGlobalConfig && this.amModalGlobalConfig.amMask != null) {
      return this.amModalGlobalConfig.amMask;
    } else {
      return true;
    }
  }

  /**
   * @description
   * The calculated highest weight of maskClosable value
   *
   * Weight of different maskClosable input:
   * component default value < global configuration < component input value
   */
  get maskClosable(): boolean {
    if (this.amMaskClosable != null) {
      return this.amMaskClosable;
    } else if (this.amModalGlobalConfig && this.amModalGlobalConfig.amMaskClosable != null) {
      return this.amModalGlobalConfig.amMaskClosable;
    } else {
      return true;
    }
  }

  locale: { okText?: string; cancelText?: string } = {};
  maskAnimationClassMap: object | null;
  modalAnimationClassMap: object | null;
  transformOrigin = '0px 0px 0px'; // The origin point that animation based on

  private contentComponentRef: ComponentRef<T>; // Handle the reference when using amContent as Component
  private animationState: AnimationState; // Current animation state
  private container: HTMLElement | OverlayRef;
  private unsubscribe$ = new Subject<void>();
  private previouslyFocusedElement: HTMLElement;
  private focusTrap: FocusTrap;
  private scrollStrategy: BlockScrollStrategy;

  [key: string]: any; // tslint:disable-line:no-any

  constructor(
    private overlay: Overlay,
    private i18n: NzI18nService,
    private cfr: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private modalControl: ModalControlService,
    private focusTrapFactory: FocusTrapFactory,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MODAL_CONFIG) private amModalGlobalConfig: ModalConfig,
    @Inject(DOCUMENT) private document: any // tslint:disable-line:no-any
  ) {
    super();
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    this.i18n.localeChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Modal') as { okText: string; cancelText: string };
    });

    fromEvent<KeyboardEvent>(this.document.body, 'keydown')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(e => this.keydownListener(e));

    if (this.isComponent(this.amContent)) {
      this.createDynamicComponent(this.amContent as Type<T>); // Create component along without View
    }

    if (this.isModalButtons(this.amFooter)) {
      // Setup default button options
      this.amFooter = this.formatModalButtons(this.amFooter as Array<ModalButtonOptions<T>>);
    }

    // Place the modal dom to elsewhere
    this.container = typeof this.amGetContainer === 'function' ? this.amGetContainer() : this.amGetContainer;
    if (this.container instanceof HTMLElement) {
      this.container.appendChild(this.elementRef.nativeElement);
    } else if (this.container instanceof OverlayRef) {
      // NOTE: only attach the dom to overlay, the view container is not changed actually
      this.container.overlayElement.appendChild(this.elementRef.nativeElement);
    }

    // Register modal when afterOpen/afterClose is stable
    this.modalControl.registerModal(this);
  }

  // [NOTE] NOT available when using by service!
  // Because ngOnChanges never be called when using by service,
  // here we can't support "amContent"(Component) etc. as inputs that initialized dynamically.
  // BUT: User also can change "amContent" dynamically to trigger UI changes (provided you don't use Component that needs initializations)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.amVisible) {
      this.handleVisibleStateChange(this.amVisible, !changes.amVisible.firstChange); // Do not trigger animation while initializing
    }
  }

  ngAfterViewInit(): void {
    // If using Component, it is the time to attach View while bodyContainer is ready
    if (this.contentComponentRef) {
      this.bodyContainer.insert(this.contentComponentRef.hostView);
    }

    if (this.autoFocusButtonOk) {
      (this.autoFocusButtonOk.nativeElement as HTMLButtonElement).focus();
    }
  }

  ngOnDestroy(): void {
    // Close self before destructing
    this.changeVisibleFromInside(false).then(() => {
      this.modalControl.deregisterModal(this);

      if (this.container instanceof OverlayRef) {
        this.container.dispose();
      }

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  keydownListener(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE && this.amKeyboard) {
      this.onClickOkCancel('cancel');
    }
  }

  open(): void {
    this.changeVisibleFromInside(true);
  }

  close(result?: R): void {
    this.changeVisibleFromInside(false, result);
  }

  destroy(result?: R): void {
    // Destroy equals Close
    this.close(result);
  }

  triggerOk(): void {
    this.onClickOkCancel('ok');
  }

  triggerCancel(): void {
    this.onClickOkCancel('cancel');
  }

  getInstance(): ModalComponent {
    return this;
  }

  getContentComponentRef(): ComponentRef<T> {
    return this.contentComponentRef;
  }

  getContentComponent(): T {
    return this.contentComponentRef && this.contentComponentRef.instance;
  }

  getElement(): HTMLElement {
    return this.elementRef && this.elementRef.nativeElement;
  }

  onClickMask($event: MouseEvent): void {
    if (
      this.mask &&
      this.maskClosable &&
      ($event.target as HTMLElement).classList.contains('ant-modal-wrap') &&
      this.amVisible
    ) {
      this.onClickOkCancel('cancel');
    }
  }

  isModalType(type: ModalType): boolean {
    return this.amModalType === type;
  }

  public onClickCloseBtn(): void {
    if (this.amVisible) {
      this.onClickOkCancel('cancel');
    }
  }

  public onClickOkCancel(type: 'ok' | 'cancel'): void {
    const trigger = { ok: this.amOnOk, cancel: this.amOnCancel }[type];
    const loadingKey = { ok: 'amOkLoading', cancel: 'amCancelLoading' }[type];
    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent());
      const caseClose = (doClose: boolean | void | {}) => doClose !== false && this.close(doClose as R); // Users can return "false" to prevent closing by default
      if (isPromise(result)) {
        this[loadingKey] = true;
        const handleThen = (doClose: boolean | void | {}) => {
          this[loadingKey] = false;
          caseClose(doClose);
        };
        (result as Promise<void>).then(handleThen).catch(handleThen);
      } else {
        caseClose(result);
      }
    }
  }

  public isNonEmptyString(value: {}): boolean {
    return typeof value === 'string' && value !== '';
  }

  public isTemplateRef(value: {}): boolean {
    return value instanceof TemplateRef;
  }

  public isComponent(value: {}): boolean {
    return value instanceof Type;
  }

  public isModalButtons(value: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  // Do rest things when visible state changed
  private handleVisibleStateChange(visible: boolean, animation: boolean = true, closeResult?: R): Promise<void> {
    if (visible) {
      // Hide scrollbar at the first time when shown up
      this.scrollStrategy.enable();
      this.savePreviouslyFocusedElement();
      this.trapFocus();
    }

    return Promise.resolve(animation ? this.animateTo(visible) : undefined).then(() => {
      // Emit open/close event after animations over
      if (visible) {
        this.amAfterOpen.emit();
      } else {
        this.amAfterClose.emit(closeResult);
        this.restoreFocus();
        this.scrollStrategy.disable();
        // Mark the for check so it can react if the view container is using OnPush change detection.
        this.cdr.markForCheck();
      }
    });
  }

  // Lookup a button's property, if the prop is a function, call & then return the result, otherwise, return itself.
  public getButtonCallableProp(options: ModalButtonOptions<T>, prop: string): {} {
    const value = options[prop];
    const args: T[] = [];
    if (this.contentComponentRef) {
      args.push(this.contentComponentRef.instance);
    }
    return typeof value === 'function' ? value.apply(options, args) : value;
  }

  // On amFooter's modal button click
  public onButtonClick(button: ModalButtonOptions<T>): void {
    const result = this.getButtonCallableProp(button, 'onClick'); // Call onClick directly
    if (isPromise(result)) {
      button.loading = true;
      (result as Promise<{}>).then(() => (button.loading = false)).catch(() => (button.loading = false));
    }
  }

  // Change amVisible from inside
  private changeVisibleFromInside(visible: boolean, closeResult?: R): Promise<void> {
    if (this.amVisible !== visible) {
      // Change amVisible value immediately
      this.amVisible = visible;
      this.amVisibleChange.emit(visible);
      return this.handleVisibleStateChange(visible, true, closeResult);
    }
    return Promise.resolve();
  }

  private changeAnimationState(state: AnimationState): void {
    this.animationState = state;
    if (state) {
      this.maskAnimationClassMap = {
        [`fade-${state}`]: true,
        [`fade-${state}-active`]: true
      };
      this.modalAnimationClassMap = {
        [`zoom-${state}`]: true,
        [`zoom-${state}-active`]: true
      };
    } else {
      this.maskAnimationClassMap = this.modalAnimationClassMap = null;
    }
  }

  private animateTo(isVisible: boolean): Promise<void> {
    if (isVisible) {
      // Figure out the lastest click position when shows up
      setTimeout(() => this.updateTransformOrigin()); // [NOTE] Using timeout due to the document.click event is fired later than visible change, so if not postponed to next event-loop, we can't get the lastest click position
    }

    this.changeAnimationState(isVisible ? 'enter' : 'leave');
    return new Promise(resolve =>
      setTimeout(
        () => {
          // Return when animation is over
          this.changeAnimationState(null);
          resolve();
        },
        this.amNoAnimation ? 0 : MODAL_ANIMATE_DURATION
      )
    );
  }

  private formatModalButtons(buttons: Array<ModalButtonOptions<T>>): Array<ModalButtonOptions<T>> {
    return buttons.map(button => {
      return {
        ...{
          type: 'default',
          size: 'default',
          autoLoading: true,
          show: true,
          loading: false,
          disabled: false
        },
        ...button
      };
    });
  }

  /**
   * Create a component dynamically but not attach to any View (this action will be executed when bodyContainer is ready)
   * @param component Component class
   */
  private createDynamicComponent(component: Type<T>): void {
    const factory = this.cfr.resolveComponentFactory(component);
    const childInjector = Injector.create({
      providers: [{ provide: ModalRef, useValue: this }],
      parent: this.viewContainer.parentInjector
    });
    this.contentComponentRef = factory.create(childInjector);
    if (this.amComponentParams) {
      Object.assign(this.contentComponentRef.instance, this.amComponentParams);
    }
    // Do the first change detection immediately (or we do detection at ngAfterViewInit, multi-changes error will be thrown)
    this.contentComponentRef.changeDetectorRef.detectChanges();
  }

  // Update transform-origin to the last click position on document
  private updateTransformOrigin(): void {
    const modalElement = this.modalContainer.nativeElement as HTMLElement;
    if (this.previouslyFocusedElement) {
      const previouslyDOMRect = this.previouslyFocusedElement.getBoundingClientRect();
      const lastPosition = getElementOffset(this.previouslyFocusedElement);
      const x = lastPosition.left + previouslyDOMRect.width / 2;
      const y = lastPosition.top + previouslyDOMRect.height / 2;
      this.transformOrigin = `${x - modalElement.offsetLeft}px ${y - modalElement.offsetTop}px 0px`;
    }
  }

  private savePreviouslyFocusedElement(): void {
    if (this.document) {
      this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
    }
  }

  private trapFocus(): void {
    if (!this.focusTrap) {
      this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    }
    this.focusTrap.focusInitialElementWhenReady();
  }

  private restoreFocus(): void {
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
    }
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }

}
