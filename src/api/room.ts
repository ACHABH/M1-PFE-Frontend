import type { FetchResponse } from "../types/http";
import type { Prettier, StrictPick } from "../types/util";
import type { Room, Rooms } from "../types/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../constant/query";
import { request } from "../utils/request";

export function useGetAll() {
  return useQuery({
    queryKey: QUERY.ROOM.ALL(),
    async queryFn(context) {
      const res = await request("/api/room/all", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        rooms: Prettier<Rooms>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.rooms;
    },
    initialData: [],
  });
}

export function useGetArchive() {
  return useQuery({
    queryKey: QUERY.ROOM.ARCHIVE(),
    async queryFn(context) {
      const res = await request("/api/room/archive", { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        rooms: Prettier<Rooms>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.rooms;
    },
    initialData: [],
  });
}

export function useGet(id: number) {
  return useQuery({
    queryKey: QUERY.ROOM.ONE(id),
    async queryFn(context) {
      if (id <= 0) return null;
      const res = await request(`/api/room/${id}`, { signal: context.signal });
      const json = (await res.json()) as FetchResponse<{
        room: Prettier<Room>;
      }>;
      if (!json.ok) throw new Error(json.message ?? "Request failed");
      return json.data.room;
    },
    initialData: null,
  });
}

type UseUpdateBody = Prettier<Partial<StrictPick<Room, "room">>>;

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
      await queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ALL() });
    },
  });
}

type UseUpdateParams = {
  id: number;
  body: UseUpdateBody;
};

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(params: UseUpdateParams) {
      return request(`/api/room/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.body),
      });
    },
    async onSuccess(res, params) {
      if (!res.ok) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ALL() }),
        queryClient.invalidateQueries({ queryKey: QUERY.ROOM.ONE(params.id) }),
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
