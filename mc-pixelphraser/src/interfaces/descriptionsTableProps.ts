import { TemporaryDescription } from "./temporaryDescription";

export interface DescriptionsTableProps {
    data: TemporaryDescription[];
    processing: string | null;
    setProcessing: (id: string | null) => void;
    setError: (error: string | null) => void;
    showSuccessMessage: (message: string) => void;
    onImageClick: (url: string) => void;
    loadDescriptions: () => Promise<void>;
  }