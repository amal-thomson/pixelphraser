export interface TemporaryDescription {
  id: string;
  version: number;
  key: string;
  value: {
    usDescription?: string | null;
    gbDescription?: string | null;
    deDescription?: string | null;
    imageUrl: string;
    productType: string;
    productName: string;
    generatedAt: string;
  };
}
