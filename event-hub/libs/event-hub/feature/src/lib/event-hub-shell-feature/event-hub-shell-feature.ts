import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'lib-event-hub-shell-feature',
  imports: [RouterModule],
  templateUrl: './event-hub-shell-feature.html',
  styleUrl: './event-hub-shell-feature.css',
})
export class EventHubShellFeature {
}


