import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventHubFeature } from './event-hub-feature';

describe('EventHubFeature', () => {
  let component: EventHubFeature;
  let fixture: ComponentFixture<EventHubFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHubFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(EventHubFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
