import type { Prettier } from "../types/util";
import type { FetchResponse } from "../types/http";
import type { Admin, Company, Student, Teacher, User } from "../types/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../utils/request";
import { QUERY } from "../constant/query";

export type FullUser = Prettier<
  User &
    Partial<{
      student: Student | null;
      teacher: Teacher | null;
      company: Company | null;
      admin: Admin | null;
    }>
>;

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.USER.ALL(),
    async queryFn(context) {
      const res = await request("/api/user/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ users: FullUser[] }>;
      return json;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: QUERY.USER.KEY,
    async queryFn(context) {
      const res = await request("/api/user", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ user: FullUser }>;
      return json;
    },
  });
}

export function useCreate() {
  return useMutation({
    mutationFn(body: object) {
      return request("/api/user", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  });
}

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: object) {
      return request("/api/user", {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() }),
        queryClient.invalidateQueries({ queryKey: QUERY.USER.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.USER.KEY }),
      ]);
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn() {
      return request("/api/user", {
        method: "DELETE",
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() }),
        queryClient.invalidateQueries({ queryKey: QUERY.USER.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.USER.KEY }),
      ]);
    },
  });
}
