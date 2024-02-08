export type FrontendError = Error | { [key: string]: string | number | undefined };

export type FrontendErrorRequest = {
  id: string;
  path: string;
  message: string;
};
