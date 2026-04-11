import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventQueryRequest, EventQueryResponse } from '../models';
import { Observable } from 'rxjs';
import { EventDto } from '../models';

@Injectable()
export class EventsService {
  #httpClient = inject(HttpClient);
  
  createEvent(event: Omit<EventDto, 'id' | 'createdAt'>) {
    return this.#httpClient.post('/api/events', event);
  }

  queryEvents(request: EventQueryRequest): Observable<EventQueryResponse> {
    return this.#httpClient.post<EventQueryResponse>('/api/events/query', request);
  }
}
