import { EventType } from "./event.model";

export interface EventQueryRequest {
  userId?: string;
  types?: EventType[];
  sortBy?: 'createdAt' | 'userId' | 'type';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
