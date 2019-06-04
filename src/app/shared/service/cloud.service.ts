import {
    Injectable,
    Inject,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
} from '@angular/core';
import { ModalService } from '../../shared/service/modal';

import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../cloud/models';
import { NodeService } from './node.service';
import { CommonResponse } from '../../shared/models';
import { downloadLink } from '../../utils/tools';
import { MessageService } from './message.service';
import { CloudBaseService } from './cloud-base.service';

import { RenameModalComponent } from '../../shared/components/rename-modal/rename-modal.component';
import { NewFolderModalComponent } from '../../shared/components/new-folder-modal/new-folder-modal.component';
import { DynamicInputComponent } from '../../shared/components/dynamic-input/dynamic-input.component';
import { CopyModalComponent } from '../../shared/components/copy-modal/copy-modal.component';
import { InvitationModalComponent } from '../../shared/components/invitation-modal/invitation-modal.component';

import { UploadFile } from '../../shared/components/dynamic-input/interfaces';
import { ImageViewerComponent } from '../../shared/components/image-viewer/image-viewer.component';
const deepcopy = require('deepcopy');

@Injectable({
    providedIn: 'root'
})
export class CloudService {

}