import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'event-hub-feature',
    loadChildren: () =>
      import('@org/event-hub-feature').then((m) => m.eventHubFeatureRoutes),
  },
];
