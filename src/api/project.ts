import type { FetchResponse } from "../types/http";
import type { Project, ProjectNote } from "../types/db";
import { useQuery } from "@tanstack/react-query";
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
      const res = await request(`/api/project/${id}`, {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<FullProject>;
      return json;
    },
  });
}
