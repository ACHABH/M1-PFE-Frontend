import { request } from "../utils/request";

export function mail(from: string, to: string, subject: string, html: string) {
  return request("/api/email", {
    method: "POST",
    body: JSON.stringify({ from, to, subject, html }),
  });
}
