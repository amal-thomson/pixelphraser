import { TemporaryDescription } from "./temporaryDescription";

export interface TemporaryDescriptionsResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: TemporaryDescription[];
}