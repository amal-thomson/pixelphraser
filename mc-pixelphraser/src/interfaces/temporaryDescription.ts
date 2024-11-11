export interface TemporaryDescription {
  id: string;
  version: number;
  key: string;
  value: {
    temporaryDescription: string | null;
    imageUrl: string;
    productName: string;
    generatedAt: string;
  };
}