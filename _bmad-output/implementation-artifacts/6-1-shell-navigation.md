---
story_id: "6.1"
epic: "Phase 6: Shell and Navigation"
title: "Create Shell Layout with Navigation"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 6.1: Create Shell Layout with Navigation

## User Story
As a user, I want a consistent layout with navigation so that I can easily move between event list and create event pages.

## Acceptance Criteria

### 6.1.1 Shell Component Created
- [ ] Generate component: `nx g @nx/angular:component shell --project=event-hub-shell`
- [ ] Create in `libs/event-hub/shell/src/lib/shell/`
- [ ] Shell contains:
  - Material Toolbar with app title "Event-Hub"
  - Router outlet for content

### 6.1.2 Navigation Links Added
- [ ] Add navigation links in toolbar:
  - "Events" → links to `/events`
  - "Create Event" → links to `/events/create`
- [ ] Use `routerLink` directive
- [ ] Use `routerLinkActive` to highlight active link

### 6.1.3 App Component Updated
- [ ] Update `app.component.html` to use shell component
- [ ] Content area shows routed components via `router-outlet`

### 6.1.4 Default Route
- [ ] Redirect empty path to `/events`
- [ ] Add wildcard route for 404

### 6.1.5 Basic Styling
- [ ] Toolbar with primary color
- [ ] Content area with proper padding
- [ ] Active link highlighted

## Technical Requirements

### Shell Component
```typescript
@Component({
  selector: 'lib-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {}
```

### Shell Template
```html
<mat-toolbar color="primary">
  <span>Event-Hub</span>
  
  <span class="spacer"></span>
  
  <a mat-button routerLink="/events" routerLinkActive="active">
    <mat-icon>list</mat-icon>
    Events
  </a>
  
  <a mat-button routerLink="/events/create" routerLinkActive="active">
    <mat-icon>add</mat-icon>
    Create Event
  </a>
</mat-toolbar>

<main class="content">
  <router-outlet></router-outlet>
</main>
```

### App Routes
```typescript
export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: EventListComponent },
      { path: 'events/create', component: EventCreateComponent },
      { path: '**', redirectTo: 'events' }
    ]
  }
];
```

### App Component
```html
<router-outlet></router-outlet>
```

Or if Shell is used differently:
```html
<lib-shell></lib-shell>
```

### Styling
```scss
.spacer {
  flex: 1 1 auto;
}

.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.active {
  background-color: rgba(255, 255, 255, 0.15);
}
```

## File Structure
```
libs/event-hub/shell/src/lib/
├── shell/
│   ├── shell.component.ts
│   ├── shell.component.html
│   └── shell.component.scss
└── index.ts (exports)
```

## Definition of Done
- [ ] Shell component with toolbar
- [ ] Navigation links working
- [ ] Active link highlighted
- [ ] Content area for routed components
- [ ] Default route redirects to events
- [ ] No console errors

## Dependencies
- Story 4.1 (Event List) should be complete
- Story 5.1 (Event Create) should be complete

## Testing
1. Load app - verify shell shows
2. Click "Events" - verify navigation
3. Click "Create Event" - verify navigation
4. Verify active link highlighted
5. Verify content shows in main area

## Notes
- Keep shell simple - just layout and navigation
- No business logic in shell
- Can add user menu later if needed
