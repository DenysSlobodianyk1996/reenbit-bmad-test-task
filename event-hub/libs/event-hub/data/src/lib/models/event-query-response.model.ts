import { EventDto } from "./event.model";

export interface EventQueryResponse {
  items: EventDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
