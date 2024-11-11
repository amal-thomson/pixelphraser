import { TemporaryDescriptionsResponse } from "../interfaces/temporaryDescriptionsResponse";

export const hasResults = (data: TemporaryDescriptionsResponse | null): boolean => {
    return !!data?.results && data.results.length > 0;
  };