import { Injectable } from '@angular/core';
import { CloudModule } from '../cloud.module';
import { Logger } from '../../shared/service/logger.service';

@Injectable({
  providedIn: CloudModule,
})
export class PeopleService {

  constructor(private logger: Logger) { }

  getPeopleList() {
    this.logger.log('Getting people list...');
  }
}
