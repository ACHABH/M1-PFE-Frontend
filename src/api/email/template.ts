import type { Prettier, StrictPick } from "../../types/util";
import type { FetchResponse } from "../../types/http";
import type { EmailTemplate, EmailTemplates } from "../../types/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../../constant/query";
import { request } from "../../utils/request";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.EMAIL.TEMPLATE.ALL(),
    async queryFn(context) {
      const res = await request("/api/email/template/all", {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<{
        email_templates: EmailTemplates;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.email_templates;
    },
    initialData: [],
  });
}

export function useGetArchive() {
  return useQuery({
    queryKey: QUERY.EMAIL.TEMPLATE.ARCHIVE(),
    async queryFn(context) {
      const res = await request("/api/email/template/archive", {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<{
        email_templates: EmailTemplates;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.email_templates;
    },
    initialData: [],
  });
}

export function useGetOne(id: number) {
  return useQuery({
    queryKey: QUERY.EMAIL.TEMPLATE.ONE(id),
    async queryFn(context) {
      if (id <= 0) return null;

      const res = await request(`/api/email/template/${id}`, {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<{
        email_template: Prettier<EmailTemplate>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json?.data?.email_template ?? null;
    },
    initialData: null,
  });
}

type UseCreateBody = Prettier<StrictPick<EmailTemplate, "subject" | "content">>;

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: UseCreateBody) {
      return request("/api/email/template", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({
        queryKey: QUERY.EMAIL.TEMPLATE.ALL(),
      });
    },
  });
}

type UseUpdateParams = {
  id: number;
  body: UseCreateBody;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: UseUpdateParams) {
      return request(`/api/email/template/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.body),
      });
    },
    async onSuccess(res, params) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.EMAIL.TEMPLATE.ALL() }),
        queryClient.invalidateQueries({
          queryKey: QUERY.EMAIL.TEMPLATE.ONE(params.id),
        }),
      ]);
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(id: number) {
      return request(`/api/email/template/${id}`, { method: "DELETE" });
    },
    async onSuccess(res, id) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.EMAIL.TEMPLATE.ALL() }),
        queryClient.invalidateQueries({
          queryKey: QUERY.EMAIL.TEMPLATE.ONE(id),
        }),
      ]);
    },
  });
}
