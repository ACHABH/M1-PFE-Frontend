import type { Room, Rooms } from "../types/db";
import type { StrictPick } from "../types/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../constant/query";
import { request } from "../utils/request";
import { FetchResponse } from "../types/http";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.ROOM.ALL(),
    async queryFn(context) {
      const res = await request("/api/room/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ rooms: Rooms }>;
      return json;
    },
  });
}

export function useGet(id: number) {
  return useQuery({
    queryKey: QUERY.ROOM.ONE(id),
    async queryFn(context) {
      const res = await request("/api/room", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{ room: Room }>;
      return json;
    },
  });
}

type UseUpdateBody = StrictPick<Room, "room">;

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(body: UseUpdateBody) {
      return request(`/api/room`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ALL() }),
      ]);
    },
  });
}

type UseUpdatePayload = {
  id: number;
  body: StrictPick<Room, "room">;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn({ id, body }: UseUpdatePayload) {
      return request(`/api/room/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res, { id }) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ONE(id) }),
      ]);
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(id: number) {
      return request(`/api/room/${id}`, { method: "DELETE" });
    },
    async onSuccess(res, id) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ONE(id) }),
      ]);
    },
  });
}
