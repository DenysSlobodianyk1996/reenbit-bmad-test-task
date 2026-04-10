import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHubCreateFeature } from './event-hub-create-feature';

describe('EventHubCreateFeature', () => {
  let component: EventHubCreateFeature;
  let fixture: ComponentFixture<EventHubCreateFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHubCreateFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventHubCreateFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
