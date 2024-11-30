import type { StrictPick } from "../types/util";
import { useMutation } from "@tanstack/react-query";
import { request } from "../utils/request";
import { User } from "../types/db";

export type UseLoginBody = Partial<StrictPick<User, "email" | "password">>;

export function useLogin() {
  return useMutation({
    async mutationFn(body: UseLoginBody) {
      const res = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  });
}

export function useLogout() {}

export function useOneTimePassword() {}

export function useForgotPassword() {}

export function useResetPassword() {}
