import Cookies from "js-cookie";
import { CODE, TOKEN } from "../constant/cookie";
import type {
  FetchResponse,
  FetchResponseDataCode,
  FetchResponseDataToken,
} from "../types/http";

export const request: typeof window.fetch = async (path, init = {}) => {
  const token = Cookies.get(TOKEN) ?? "";

  const res = await fetch(`http://127.0.0.1:8000${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  const resClone = res.clone();

  const json = (await res.json()) as FetchResponse<
    Partial<FetchResponseDataCode & FetchResponseDataToken>
  >;

  if (import.meta.env.DEV) {
    console.log(`${path}:`, json);
  }

  if (!json?.ok) return resClone;

  const responseToken = json?.data?.token ?? "";
  if (responseToken.length > 0) {
    Cookies.set(TOKEN, responseToken, {
      sameSite: "Lax",
      secure: import.meta.env.PROD,
      path: "/",
      expires: 30,
    });
  }

  const responseCode = json?.data?.code ?? "";
  if (responseCode.length > 0) {
    Cookies.set(CODE, responseCode, {
      sameSite: "Lax",
      secure: import.meta.env.PROD,
      path: "/",
      expires: 1,
    });
  }

  return resClone;
};
