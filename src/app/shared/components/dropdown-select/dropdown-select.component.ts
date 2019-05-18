import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injectable,
  Inject,
  Input,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  ChangeDetectionStrategy,
  ComponentRef,
  EmbeddedViewRef,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DropdownSelectOptionsComponent } from '../dropdown-select-options/dropdown-select-options.component';
import { SelectOption } from '../dropdown-select-options/dropdown-select-options.component'
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownSelectComponent {
  

  @Input() multiple: boolean = false;

  @Input() options: Array<any> = [];

  @Input() value: any;

  @Input() showIcon: boolean = true;

  @Input() default: Array<SelectOption>;

  @Output() readonly onChange = new EventEmitter<Array<any>>();

  private _selectedOptions: Array<any> = [];
  private _valueString: string = '';
  private _overlayRef: OverlayRef | null;


  constructor(
    private overlay: Overlay,
    private ref: ElementRef,
  ) {
    this.options = [
      {
        key: 'aaa',
        label: 'aaa',
        value: 1
      },
      {
        key: 'bbb',
        label: 'bbb',
        value: 2
      },
      {
        key: 'ccc',
        label: 'ccc',
        value: 3
      },
    ];
  }

  create($event: MouseEvent): DropdownSelectOptionsComponent {
    event.stopPropagation();
    this.dispose();
    this._overlayRef = this.overlay.create(
      new OverlayConfig({
        scrollStrategy: this.overlay.scrollStrategies.close(),
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.ref)
          .withPositions([{
            originX: 'start',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetX: 0,
            offsetY: 0
          }])
      })
    );
    const instance = this._overlayRef.attach(new ComponentPortal(DropdownSelectOptionsComponent)).instance;
    instance.options = this.options;
    instance.multiple = this.multiple;
    instance.onValueChange = this.onValueChange.bind(this);
    instance.selectedOptions = this._selectedOptions.concat();
    instance.showIcon = this.showIcon;
    if (this.default) {
      instance.default = this.default;
    }
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => !!this._overlayRef && !this._overlayRef.overlayElement.contains(event.target as HTMLElement) && event.target !== $event.target),
        take(1)
      )
      .subscribe(() => instance.close());
    return instance;
  }

  onValueChange(selectedOptions: Array<SelectOption>): void {
    this._selectedOptions = selectedOptions.concat();
    this._valueString = '';
    if (this.multiple) {
      for (let i = 0, l = this.options.length; i < l; i++) {
        if (this._selectedOptions.some((ele) => ele['key'] === this.options[i]['key'])) {
          this._valueString += this.options[i]['label'] + ';';
        }
      }
    } else {
      this._valueString = this._selectedOptions[0]['label'];
    }
    this.onChange.emit(this._selectedOptions);
  }



  dispose(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  get valueString(): string {
    return this._valueString;
  }
}
