import type { FullUser } from "./user";
import type { Prettier, StrictOmit } from "../types/util";
import type { FetchResponse } from "../types/http";
import { useQuery } from "@tanstack/react-query";
import { QUERY } from "../constant/query";
import { request } from "../utils/request";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.TEACHER.ALL(),
    async queryFn(context) {
      const res = await request("/api/teacher/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        teachers: Prettier<StrictOmit<FullUser, "student" | "company" | "admin">>;
      }>;
      return json;
    },
  });
}
