import type {
  Project,
  ProjectJury,
  ProjectNote,
  ProjectProposition,
  ProjectPropositionFeedback,
} from "../types/db";
import type { FetchResponse } from "../types/http";
import type { Prettier } from "../types/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../utils/request";
import { QUERY } from "../constant/query";

export type FullProject = Prettier<
  Project &
    Partial<{
      project_note: ProjectNote | null;
      project_proposition: ProjectProposition | null;
      project_jury: ProjectJury | null;
      project_proposition_feedback: ProjectPropositionFeedback | null;
    }>
>;

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.PROJECT.ALL(),
    async queryFn(context) {
      const res = await request("/api/project/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        projects: Prettier<FullProject[]>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.projects;
    },
    initialData: [],
  });
}

export function useGetArchive() {
  return useQuery({
    queryKey: QUERY.PROJECT.ARCHIVE(),
    async queryFn(context) {
      const res = await request("/api/project/archive", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        projects: Prettier<FullProject[]>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.projects;
    },
    initialData: [],
  });
}

export function useGetOne(id: number) {
  return useQuery({
    queryKey: QUERY.PROJECT.ONE(id),
    async queryFn(context) {
      if (id <= 0) return null;

      const res = await request(`/api/project/${id}`, {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<{
        project: FullProject;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.project;
    },
    initialData: null,
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

export function useUpdate(proposalID: number, p0: { description: (data: any) => any; }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: UseUpdateParams) {
      return request(`/api/project/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.body),
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
      return request(`/api/project/${id}`, {
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

export function useValidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn(id: number) {
      return request(`/api/project/validate/${id}`, {
        method: "PATCH",
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

type ProjectPropositionParams = {
  id: number;
  body: { feedback: ProjectPropositionFeedback["feedback"] };
};

export function useReject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: ProjectPropositionParams) {
      return request(`/api/project/reject/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(params.body),
      });
    },
    async onSuccess(res, params) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.PROJECT.ONE(params.id) }),
      ]);
    },
  });
}
