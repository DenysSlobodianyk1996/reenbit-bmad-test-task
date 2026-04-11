import { EventType } from "./event.model";
import {SortDirection} from '@angular/material/sort';

export interface EventQueryRequest {
  userId?: string;
  types?: EventType[];
  sortBy?: string;
  sortOrder?: SortDirection;
  page: number;
  pageSize: number;
}
