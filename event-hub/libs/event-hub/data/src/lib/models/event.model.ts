  export interface EventDto {
    id: string;
    userId: string;
    type: EventType;
    description: string;
    createdAt: string;
  }

  export enum EventType {
    PageView = 'PageView',
    Click = 'Click',
    Purchase = 'Purchase'
  }
