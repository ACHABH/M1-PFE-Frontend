import type { StrictPick } from "../../types/util";
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
      return json;
    },
  });
}

export function useGet(id: number) {
  return useQuery({
    queryKey: QUERY.EMAIL.TEMPLATE.ONE(id),
    async queryFn(context) {
      const res = await request(`/api/email/template/${id}`, {
        signal: context.signal,
      });
      const json = (await res.json()) as FetchResponse<{
        email_template: EmailTemplate;
      }>;
      return json;
    },
  });
}

type UseCreateBody = StrictPick<EmailTemplate, "subject" | "content">;

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

type UseUpdatePayload = {
  id: number;
  body: StrictPick<EmailTemplate, "subject" | "content">;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn({ id, body }: UseUpdatePayload) {
      return request(`/api/email/template/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res, { id }) {
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
