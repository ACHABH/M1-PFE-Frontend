import type { FullUser } from "./user";
import type { Prettier, StrictOmit } from "../types/util";
import type { FetchResponse } from "../types/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../utils/request";
import { QUERY } from "../constant/query";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.ADMIN.ALL(),
    async queryFn(context) {
      const res = await request("/api/admin/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        admins: Prettier<StrictOmit<FullUser, "student" | "company" | "teacher">>;
      }>;
      return json;
    },
  });
}

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: object) {
      return request("/api/admin", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({ queryKey: QUERY.ADMIN.ALL() });
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: object) {
      return request("/api/admin", {
        method: "DELETE",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({ queryKey: QUERY.ADMIN.ALL() });
    },
  });
}
