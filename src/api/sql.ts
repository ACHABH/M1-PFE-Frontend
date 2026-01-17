import { useQuery } from "@tanstack/react-query";
import { request } from "../utils/request";

export type Query = string;

export type QueryType = "select" | "insert" | "update" | "delete";

export async function sql(type: QueryType, query: Query) {
  const res = await request("/api/sql", {
    method: "POST",
    body: JSON.stringify({
      type,
      query,
    }),
  });
  const json = await res.json();
  console.log(type, query, json);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return json as any;
}

export function useSelectSql(query: Query) {
  return useQuery({
    queryKey: [`${Date.now() * Math.random()}`],
    queryFn: async () => {
      return sql("select", query);
    },
  });
}
