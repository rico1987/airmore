import { Observable, Subscription } from 'rxjs';

/** 状态 */
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

/** 文件对象 */
export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    filename?: string;
    lastModified?: string;
    lastModifiedDate?: Date;
    url?: string;
    status?: UploadFileStatus;
    originFileObj?: File;
    percent?: number;
    thumbUrl?: string;
    response?: any;
    error?: any;
    linkProps?: { download: string };
    type: string;
    progress?: number;
    key?: string;
    [key: string]: any;
}

export interface uploadOptions {
    disabled?: boolean;
    accept?: string | string[];
    multiple?: boolean;
    filters?: UploadFilter[];
    folder?: boolean;
}

export interface UploadFilter {
    name: string;
    fn: (fileList: UploadFile[]) => UploadFile[] | Observable<UploadFile[]>;
}