import type { FetchResponseSuccess } from "../types/http";
import type { User } from "../types/db";
import { request } from "../utils/request";

export async function auth(init: RequestInit = {}) {
  const res = await request("/api/auth/status", init);
  const json = (await res.json()) as FetchResponseSuccess<{
    user: User | null;
  }>;
  return json?.data?.user ?? null;
}
