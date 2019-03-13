import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyClientService } from '../../shared/service/my-client.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {
    constructor(
        private myClientService: MyClientService,
    ) { }
}

