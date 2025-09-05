export interface AppDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
}

export interface QAResponse {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface DocumentWithQA extends AppDocument {
  qaHistory: QAResponse[];
}