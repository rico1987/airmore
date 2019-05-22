import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from './logger.service';
import { MyClientService } from './my-client.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    private myClientService: MyClientService,
    private logger: Logger,
  ) { }

  getPeopleList(page: number, per_page: number): Observable < any > {
    return this.myClientService.get('cloud', '/people', {
      page,
      per_page,
    });
  }

  deletePeople(id: number): Observable < any > {
    return this.myClientService.delete('cloud', `/people/${id}`);
  }

  modifyPeople(id: number, name?: string, cover_face_id?: string): Observable < any > {
    const data = {
      id,
    };
    if (name) {
      data['name'] = name;
    }
    if (cover_face_id) {
      data['cover_face_id'] = cover_face_id;
    }
    return this.myClientService.put('cloud', `/people/${id}`, data);
  }

  getPeopleFaces(id: number, per_page: number, page: number): Observable < any > {
    return this.myClientService.get('cloud', `/people/${id}/faces`, {
      page,
      per_page,
    });
  }

  getPeopleFiles(id: number, per_page: number, page: number): Observable < any > {
    return this.myClientService.get('cloud', `/people/${id}/files`, {
      page,
      per_page,
    });
  }
}
