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
import { isArray } from '../../../utils/is'; 


@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownSelectComponent implements OnInit {
  

  @Input() multiple: boolean = false;

  @Input() options: Array<any> = [];

  @Input() value: any;

  @Input() showIcon: boolean = true;

  @Input() default: Array<string | number> | string | number;

  @Output() readonly onChange = new EventEmitter<Array<any>>();

  private _selectedOptions: Array<any> = [];
  private _valueString: string = '';
  private _overlayRef: OverlayRef | null;


  constructor(
    private overlay: Overlay,
    private ref: ElementRef,
  ) {
  }

  ngOnInit() {
    console.log(this.default);
    if (this.default) {
      if (isArray(this.default)) {
        for (let i = 0, l = this.options.length; i < l; i++)  {
          if ((this.default as Array<number | string>).some((ele) => this.options[i]['key'] === ele)) {
            this._selectedOptions.push(this.options[i]);
          }
        }
      } else {
        this._selectedOptions = [this.options.find((ele) => ele['key'] === this.default)];
      }
    }
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
    this.onChange.emit(this._selectedOptions);
  }


  dispose(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  get valueString(): string {
    if (this._selectedOptions.length === 0) {
      return '';
    }
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
    return this._valueString;
  }
}
