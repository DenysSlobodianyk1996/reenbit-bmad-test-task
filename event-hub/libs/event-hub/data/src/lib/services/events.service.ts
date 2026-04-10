import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventQueryRequest, EventQueryResponse } from '../models';
import { catchError, Observable, of } from 'rxjs';
import { EventDto } from '../models';

@Injectable()
export class EventsService {
  #httpClient = inject(HttpClient);
  
  createEvent(event: Omit<EventDto, 'id' | 'createdAt'>) {
    return this.#httpClient.post('/api/events', event).pipe(catchError(() => of(event)));
  }

  queryEvents(request: EventQueryRequest): Observable<EventQueryResponse> {
    // const tempEvent = {
    //   id: '2ew4'
    //   userId: 'asdad',
    //   type: 'PageView'
    //   description: 'test'
    //   createdAt: ''
    // } as EventDto;
    return this.#httpClient.post<EventQueryResponse>('/api/events/query', request).pipe(
      catchError(() => of({
        items: [],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }))
    );
  }
}
