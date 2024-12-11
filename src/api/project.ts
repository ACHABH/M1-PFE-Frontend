import type { FetchResponse } from "../types/http";
import type { Project, ProjectNote } from "../types/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../utils/request";
import { QUERY } from "../constant/query";

export type FullProject = Project &
  Partial<{
    project_note: ProjectNote | null;
  }>;

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.PROJECT.ALL(),
    async queryFn(context) {
      const res = await request("/api/project/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<FullProject[]>;
      return json;
    },
  });
}

export function useGetOne(id: number) {
  return useQuery({
    queryKey: QUERY.PROJECT.ONE(id),
    async queryFn(context) {
      const res = await request(`/api/project/${encodeURIComponent(id)}`, {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<FullProject>;
      return json;
    },
  });
}

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: object) {
      return request(`/api/project`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ALL() });
    },
  });
}

type UseUpdateParams = {
  id: number;
  body: object;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: UseUpdateParams) {
      return request(`/api/project/${encodeURIComponent(params.id)}`, {
        method: "PUT",
      });
    },
    async onSuccess(res, params) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ALL() }),
        queryClient.invalidateQueries({
          queryKey: QUERY.PROJECT.ONE(params.id),
        }),
      ]);
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(id: number) {
      return request(`/api/project/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
    async onSuccess(res, id) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ONE(id) }),
      ]);
    },
  });
}
