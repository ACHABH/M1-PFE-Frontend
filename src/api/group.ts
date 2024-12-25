import type { Group, GroupMembers, ProjectSubmit } from "../types/db";
import type { FetchResponse } from "../types/http";
import type { Prettier } from "../types/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../constant/query";
import { request } from "../utils/request";

export type FullGroup = Prettier<
  Group &
    Partial<{
      group_member: GroupMembers | null;
      project_submit: ProjectSubmit | null;
    }>
>;

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.GROUP.ALL(),
    async queryFn(context) {
      const res = await request("/group/all", { signal: context.signal });

      const json = (await res.json()) as FetchResponse<{ groups: FullGroup[] }>;
      if (!json.ok) {
        throw new Error(json.message ?? "Request failed");
      }
      return json?.data?.groups ?? [];
    },
    initialData: [],
  });
}

export function useGetArchive() {
  return useQuery({
    queryKey: QUERY.GROUP.ARCHIVE(),
    async queryFn(context) {
      const res = await request("/group/archive", { signal: context.signal });

      const json = (await res.json()) as FetchResponse<{ groups: FullGroup[] }>;
      if (!json.ok) {
        throw new Error(json.message ?? "Request failed");
      }
      return json?.data?.groups ?? [];
    },
    initialData: [],
  });
}

export function useGetOne(id: number) {
  return useQuery({
    queryKey: QUERY.GROUP.ONE(id),
    async queryFn(context) {
      if (id <= 0) return null;

      const res = await request(`/group/${id}`, { signal: context.signal });

      const json = (await res.json()) as FetchResponse<{ group: FullGroup }>;
      if (!json.ok) {
        throw new Error(json.message ?? "Request failed");
      }

      return json?.data?.group ?? null;
    },
    initialData: null,
  });
}

type UseCreateBody = { student_ids: number[] };

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: UseCreateBody) {
      return request("/group", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ARCHIVE() }),
      ]);
    },
  });
}

type UseUpdateParams = {
  group_id: number;
  body: UseCreateBody;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: UseUpdateParams) {
      return request(`/group/${params.group_id}`, {
        method: "PUT",
        body: JSON.stringify(params.body),
      });
    },
    async onSuccess(res, params) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ARCHIVE() }),
        queryClient.invalidateQueries({
          queryKey: QUERY.GROUP.ONE(params.group_id),
        }),
      ]);
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(id: number) {
      return request(`/group/${id}`, {
        method: "DELETE",
      });
    },
    async onSuccess(res, id) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ARCHIVE() }),
        queryClient.invalidateQueries({ queryKey: QUERY.GROUP.ONE(id) }),
      ]);
    },
  });
}
