import { Route } from '@angular/router';
import { EventHubOverviewFeature } from './event-hub-overview-feature/event-hub-overview-feature';
import { EventHubShellFeature } from './event-hub-shell-feature/event-hub-shell-feature';
import { EventHubCreateFeature } from './event-hub-create-feature/event-hub-create-feature';
import { EventsService } from '@org/data';

export const eventHubFeatureRoutes: Route[] = [
  {
    path: '',
    component: EventHubShellFeature,
    providers: [EventsService],
    children: [
      { path: 'overview', component:  EventHubOverviewFeature, data: {title: 'Overview'} },
      { path: 'create', component:  EventHubCreateFeature, data: {title: 'Create Event'} },
      {
        path: '**',
        redirectTo: 'overview'
      }
    ]
  }
];
