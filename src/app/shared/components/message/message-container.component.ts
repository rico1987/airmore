import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Optional,
    ViewEncapsulation
} from '@angular/core';
import { MessageConfig, MESSAGE_CONFIG, MESSAGE_DEFAULT_CONFIG } from './message-config';
import { MessageDataOptions, MessageDataFilled } from './message.definitions';
import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-message-container',
  exportAs: 'messageContainer',
  preserveWhitespaces: false,
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent {

  messages: MessageDataFilled[] = [];
  config: Required<MessageConfig>;
  top: string | number;

  constructor(
    protected cdr: ChangeDetectorRef,
    @Optional() @Inject(MESSAGE_DEFAULT_CONFIG) defaultConfig: MessageConfig,
    @Optional() @Inject(MESSAGE_CONFIG) config: MessageConfig,
  ) {
    console.log({ ...defaultConfig, ...config });
    this.setConfig({ ...defaultConfig, ...config });
  }

  setConfig(config: MessageConfig): void {
    this.config = { ...this.config, ...config };
    this.top = this.config.top;
    this.cdr.markForCheck();
  }

  createMessage(message: MessageDataFilled): void {
      if (this.messages.length >= this.config.maxStack) {
          this.messages.splice(0, 1);
      }
      message.options = this._mergeMessageOptions(message.options);
      message.onClose = new Subject<boolean>();
      this.messages.push(message);
      this.cdr.detectChanges();
  }

  removeMessage(messageId: string, userAction: boolean = false): void {
      this.messages.some((message, index) => {
          if (message.messageId === messageId) {
            this.messages.splice(index, 1);
            this.cdr.detectChanges();
            // tslint:disable-next-line
            message.onClose!.next(userAction);
            // tslint:disable-next-line
            message.onClose!.complete();
            return true;
          }
          return false;
      });
  }

  removeMEssageAll(): void {
      this.messages = [];
      this.cdr.detectChanges();
  }


  protected _mergeMessageOptions(options?: MessageDataOptions): MessageDataOptions {
      const defaultOptions: MessageDataOptions = {
          duration: this.config.duration,
          animate: this.config.animate,
          pauseOnHover: this.config.pauseOnHover,
      };
      return { ...defaultOptions, ...options };
  }
}
