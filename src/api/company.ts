import type { FullUser } from "./user";
import type { Prettier, StrictOmit } from "../types/util";
import type { FetchResponse } from "../types/http";
import { useQuery } from "@tanstack/react-query";
import { QUERY } from "../constant/query";
import { request } from "../utils/request";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.COMPANY.ALL(),
    async queryFn(context) {
      const res = await request("/api/company/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        companies: Prettier<StrictOmit<FullUser, "student" | "teacher" | "admin">>;
      }>;
      return json;
    },
  });
}
