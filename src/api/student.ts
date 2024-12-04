import type { FullUser } from "./user";
import type { Prettier, StrictOmit } from "../types/util";
import type { FetchResponse } from "../types/http";
import { QUERY } from "../constant/query";
import { useQuery } from "@tanstack/react-query";
import { request } from "../utils/request";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.STUDENT.ALL(),
    async queryFn(context) {
      const res = await request("/api/student/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        students: Prettier<StrictOmit<FullUser, "company" | "teacher" | "admin">>;
      }>;
      return json;
    },
  });
}
