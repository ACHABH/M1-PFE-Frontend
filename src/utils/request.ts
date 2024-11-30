import Cookies from "js-cookie";
import { CODE, TOKEN } from "../constant/cookie";
import type {
  FetchResponse,
  FetchResponseDataCode,
  FetchResponseDataToken,
} from "../types/http";

export const request: typeof window.fetch = async (path, init = {}) => {
  const token = Cookies.get(TOKEN);

  const res = await fetch(`http://127.0.0.1:8000${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) return res;

  const json = (await res.json()) as FetchResponse<
    Partial<FetchResponseDataCode & FetchResponseDataToken>
  >;
  if (!json?.ok) return res;
  if (!("token" in json) && !("code" in json)) return res;

  Cookies.set(TOKEN, json?.data?.token ?? "", {
    sameSite: "Lax",
    secure: import.meta.env.PROD,
    path: "/",
    expires: 30,
  });
  Cookies.set(CODE, json?.data?.code ?? "", {
    sameSite: "Lax",
    secure: import.meta.env.PROD,
    path: "/",
    expires: 1,
  });

  return res;
};
