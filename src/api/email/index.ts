import type { Admin, Email, User } from "../../types/db";
import type { FetchResponse } from "../../types/http";
import type { Prettier, StrictPick } from "../../types/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../../constant/query";
import { request } from "../../utils/request";

export type FullEmail = Prettier<
  Email &
    Partial<{
      user: User | null;
      admin: Admin | null;
    }>
>;

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.EMAIL.ALL(),
    async queryFn(context) {
      const res = await request("/api/email/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ emails: FullEmail[] }>;
      return json;
    },
  });
}

export function useGet(id: number) {
  return useQuery({
    queryKey: QUERY.EMAIL.ONE(id),
    async queryFn(context) {
      const res = await request(`/api/email/${id}`, { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ email: FullEmail }>;
      return json;
    },
  });
}

type UseSendBody = StrictPick<
  Email,
  "subject" | "content" | "admin_id" | "receiver_id"
>;

export function useSend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: UseSendBody) {
      return request("/api/email/send", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({ queryKey: QUERY.EMAIL.ALL() });
    },
  });
}
