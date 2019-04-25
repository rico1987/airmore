import { Overlay } from '@angular/cdk/overlay';
import {
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    Injectable,
    Injector,
    TemplateRef,
    Type
} from '@angular/core';
import { Message } from '../models/message.model';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { MessageConfig } from '../components/message/message-config';
import { MessageContainerComponent } from '../components/message/message-container.component';
import { MessageDataOptions, MessageDataFilled, MessageData } from '../components/message/message.definitions';


let globalCounter = 0;

export class MessageBaseService<
    ContainerClass extends MessageContainerComponent,
    MessageData,
    Config extends MessageConfig
> {
    protected _container: ContainerClass;

    constructor(
        private overlay: Overlay,
        private containerClass: Type<ContainerClass>,
        private injector: Injector,
        private cfr: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private _idPrefix: string = ''
    ) {
        this._container = this.createContainer();
    }

    remove(messageId?: string): void {
        if (messageId) {
            this._container.removeMessage(messageId);
        } else {
            this._container.removeMEssageAll();
        }
    }

    createMessage(message: MessageData, options?: MessageDataOptions): MessageDataFilled {
        const resultMessage: MessageDataFilled = {
            ...(message as MessageData),
            ...{
                createAt: new Date(),
                messageId: this._generateMessageId(),
                options
            }
        };
        this._container.createMessage(resultMessage);

        return resultMessage;
    }

    config(config: Config): void {
        this._container.setConfig(config);
    }

    protected _generateMessageId(): string {
        return this._idPrefix + globalCounter++;
    }

    private createContainer(): ContainerClass {
        const factory = this.cfr.resolveComponentFactory(this.containerClass);
        const componentRef = factory.create(this.injector);
        componentRef.changeDetectorRef.detectChanges();
        this.appRef.attachView(componentRef.hostView);
        const overlayPane = this.overlay.create().overlayElement;
        overlayPane.style.zIndex = '1010';
        overlayPane.appendChild((componentRef.hostView as EmbeddedViewRef<{}>).rootNodes[0] as HTMLElement);

        return componentRef.instance;
    }
}

@Injectable({
    providedIn: 'root'
})
export class MessageService extends MessageBaseService<
    MessageContainerComponent,
    MessageData,
    MessageConfig
> {
    constructor(overlay: Overlay, injector: Injector, cfr: ComponentFactoryResolver, appRef: ApplicationRef) {
        super(overlay, MessageContainerComponent, injector, cfr, appRef, 'message-');
    }

    success(content: string | TemplateRef<void>, options?: MessageDataOptions): MessageDataFilled {
        return this.createMessage({ type: 'success', content }, options);
    }

    error(content: string | TemplateRef<void>, options?: MessageDataOptions): MessageDataFilled {
        return this.createMessage({ type: 'error', content }, options);
    }

    info(content: string | TemplateRef<void>, options?: MessageDataOptions): MessageDataFilled {
        return this.createMessage({ type: 'info', content }, options);
    }

    warning(content: string | TemplateRef<void>, options?: MessageDataOptions): MessageDataFilled {
        return this.createMessage({ type: 'warning', content }, options);
    }

    loading(content: string | TemplateRef<void>, options?: MessageDataOptions): MessageDataFilled {
        return this.createMessage({ type: 'loading', content }, options);
    }

    create(
        type: 'success' | 'info' | 'warning' | 'error' | 'loading' | string,
        content: string | TemplateRef<void>,
        options?: MessageDataOptions
    ): MessageDataFilled {
    return this.createMessage({ type, content }, options);
    }

}
