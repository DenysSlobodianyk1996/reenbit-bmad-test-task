import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventHubOverviewFeature } from './event-hub-overview-feature';

describe('EventHubOverviewFeature', () => {
  let component: EventHubOverviewFeature;
  let fixture: ComponentFixture<EventHubOverviewFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHubOverviewFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(EventHubOverviewFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
