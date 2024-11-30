export type FetchResponseDataToken = { token: string };

export type FetchResponseDataCode = { code: string };

export type FetchResponseSuccess<T = unknown> = {
  ok: true;
  data: T;
};

export type FetchResponseFailed<T = unknown> = {
  ok: false;
  message: string;
  reasons: T[];
};

export type FetchResponse<T = unknown> =
  | FetchResponseSuccess<T>
  | FetchResponseFailed<T>;
