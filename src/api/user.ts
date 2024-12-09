import type { Prettier, StrictPick } from "../types/util";
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
      if (!json.ok) throw new Error(json?.message ?? "Request failed");
      return json.data.users;
    },
    initialData: [],
  });
}

export function useProfile() {
  return useQuery({
    queryKey: QUERY.USER.KEY,
    async queryFn(context) {
      const res = await request("/api/user", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ user: FullUser }>;
      if (!json.ok) throw new Error(json?.message ?? "Request failed");
      return json.data.user;
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

type UseUpdateArgs = {
  user_id?: number;
  body: object;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(args: UseUpdateArgs) {
      return request(
        `/api/user?user_id=${encodeURIComponent(args.user_id ?? 0)}`,
        {
          method: "PUT",
          body: JSON.stringify(args.body),
        }
      );
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
    mutationFn(user_id?: number) {
      return request(`/api/user?user_id=${encodeURIComponent(user_id ?? 0)}`, {
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
