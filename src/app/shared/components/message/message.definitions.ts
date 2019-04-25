import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export type MessageType = 'success' | 'info' | 'warning' | 'error';

export interface MessageDataOptions {
    duration?: number;
    animate?: boolean;
    pauseOnHover?: boolean;
}

export interface MessageData {
    type?: MessageType | string;
    content?: string | TemplateRef<void>;
}

export interface MessageDataFilled extends MessageData {
    messageId: string;
    createAt: Date;

    options?: MessageDataOptions;
    state?: 'enter' | 'leave';
    onClose?: Subject<boolean>;
}
