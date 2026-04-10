import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventHubShellFeature } from './event-hub-shell-feature';

describe('EventHubShellFeature', () => {
  let component: EventHubShellFeature;
  let fixture: ComponentFixture<EventHubShellFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHubShellFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(EventHubShellFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
