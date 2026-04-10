import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-event-hub-create-feature',
  imports: [],
  templateUrl: './event-hub-create-feature.html',
  styleUrl: './event-hub-create-feature.css',
})
export class EventHubCreateFeature {
  title = input<string>('');
}
