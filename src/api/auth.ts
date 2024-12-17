import type { Prettier, StrictPick } from "../types/util";
import type { User } from "../types/db";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { request } from "../utils/request";
import { CODE, TOKEN } from "../constant/cookie";
import { QUERY } from "../constant/query";
import { auth } from "../lib/auth";

export type UseLoginBody = Prettier<
  Partial<StrictPick<User, "email" | "password"> & { remember: boolean }>
>;

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/auth/login" });

  return useMutation({
    mutationFn(body: UseLoginBody) {
      return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async onSuccess(res, body) {
      if (!res.ok) return;

      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });

      if (body.password?.length === 0) {
        navigate({
          to: "/auth/one-time-password",
          search: { email: body.email },
        });
      } else {
        navigate({
          to: "/dashboard",
        });
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn() {
      return request("/api/auth/logout", {
        method: "POST",
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;

      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });

      Cookies.remove(TOKEN);
      Cookies.remove(CODE);

      navigate({ to: "/" });
    },
  });
}

export type UseOneTimePasswordBody = { code: string };

export function useOneTimePassword() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/auth/one-time-password" });
  const search = useSearch({ strict: false }) as { email?: string };

  useEffect(() => {
    if (typeof search?.email === "undefined" || search?.email?.length <= 0) {
      navigate({ to: "/auth/login" });
      return;
    }
  }, [navigate, search]);

  return useMutation({
    mutationFn(body: UseOneTimePasswordBody) {
      const encryptedCode = Cookies.get(CODE);
      return request("/api/auth/one-time-password", {
        method: "POST",
        body: JSON.stringify({
          email: search.email!,
          encrypted_code: encryptedCode,
          ...body,
        }),
      });
    },
    async onSuccess(res) {
      if (!res.ok) return;
      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });
      navigate({ to: "/dashboard" });
      Cookies.remove(CODE);
    },
  });
}

export type UseForgetPasswordBody = Prettier<StrictPick<User, "email">>;

export function useForgetPassword() {
  const navigate = useNavigate({ from: "/auth/forget-password" });

  return useMutation({
    mutationFn(body: UseForgetPasswordBody) {
      return request("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess(res, body) {
      if (!res.ok) return;
      navigate({ to: "/auth/reset-password", search: { email: body.email } });
    },
  });
}

export type UseResetPasswordBody = Prettier<
  StrictPick<User, "password"> & {
    password_confirmation: string;
  } & { code: string }
>;

export function useResetPassword() {
  const navigate = useNavigate({ from: "/auth/reset-password" });
  const search = useSearch({ strict: false }) as { email?: string };

  useEffect(() => {
    if (typeof search?.email === "undefined" || search?.email?.length <= 0) {
      navigate({ to: "/auth/login" });
      return;
    }
  }, [navigate, search]);

  return useMutation({
    mutationFn(body: UseResetPasswordBody) {
      const encryptedCode = Cookies.get(CODE);
      return request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: search.email!,
          encrypted_code: encryptedCode,
          ...body,
        }),
      });
    },
    onSuccess(res) {
      if (!res.ok) return;
      navigate({ to: "/auth/login" });
      Cookies.remove(CODE);
    },
  });
}

export type UseAuthCallback = (user: User | null) => void | Promise<void>;

export function useAuth(callback?: UseAuthCallback) {
  const { data } = useSuspenseQuery({
    queryKey: QUERY.AUTH.STATUS(),
    async queryFn(context) {
      const user = await auth({ signal: context.signal });
      await callback?.(user);
      return user;
    },
    initialData: null,
  });
  return data;
}
