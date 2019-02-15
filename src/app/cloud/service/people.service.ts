import { Injectable } from '@angular/core';
import { Logger } from '../../shared/service/logger.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private logger: Logger) { }

  getPeopleList() {
    this.logger.log('Getting people list...');
  }
}
