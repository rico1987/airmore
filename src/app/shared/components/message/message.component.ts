import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { moveUpMotion } from '../../animations/move';
import { MessageDataFilled, MessageDataOptions } from './message.definitions';
import { MessageContainerComponent } from './message-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-message',
  exportAs: 'message',
  preserveWhitespaces: false,
  animations: [moveUpMotion],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  @Input() message: MessageDataFilled;
  @Input() index: number;

  protected _options: Required<MessageDataOptions>;
  private _autoErase: boolean;
  private _eraseTimer: number | null = null;
  private _eraseTimingStart: number;
  private _eraseTTL: number; // Time to Live.

  constructor(
    private _messageContainer: MessageContainerComponent,
    protected cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._options = this.message.options as Required<MessageDataOptions>;

    if (this._options.animate) {
      this.message.state = 'enter';
    }

    this._autoErase = this._options.duration > 0;

    if (this._autoErase) {
      this._initErase();
      this._startEraseTimeout();
    }
  }

  ngOnDestroy(): void {
    if (this._autoErase) {
      this._clearEraseTimeout();
    }
  }

  close(): void {
    this._destroy();
  }

  onEnter(): void {
    if (this._autoErase && this._options.pauseOnHover) {
      this._clearEraseTimeout();
      this._updateTTL();
    }
  }

  onLeave(): void {
    if (this._autoErase && this._options.pauseOnHover) {
      this._startEraseTimeout();
    }
  }

  protected _destroy(userAction: boolean = false): void {
    if (this._options.animate) {
      this.message.state = 'leave';
      this.cdr.detectChanges();
      setTimeout(() => this._messageContainer.removeMessage(this.message.messageId, userAction), 200);
    } else {
      this._messageContainer.removeMessage(this.message.messageId, userAction);
    }
  }

  private _initErase(): void {
    this._eraseTTL = this._options.duration;
    this._eraseTimingStart = Date.now();
  }

  private _updateTTL(): void {
    if (this._autoErase) {
      this._eraseTTL -= Date.now() - this._eraseTimingStart;
    }
  }

  private _startEraseTimeout(): void {
    if (this._eraseTTL > 0) {
      this._clearEraseTimeout();
      this._eraseTimer = window.setTimeout(() => this._destroy(), this._eraseTTL);
      this._eraseTimingStart = Date.now();
    } else {
      this._destroy();
    }
  }

  private _clearEraseTimeout(): void {
    if (this._eraseTimer !== null) {
      clearTimeout(this._eraseTimer);
      this._eraseTimer = null;
    }
  }

}
