export type UserCredentials = {
  email: string;
  password: string;
};

export type GetAppDataOptions = {
  details?: {
    filters?: string;
    cc?: string;
    language?: string;
  };
  news?: {
    count?: number;
    maxlength?: number;
  };
};