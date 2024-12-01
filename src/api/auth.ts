import type { StrictPick } from "../types/util";
import type { User } from "../types/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { request } from "../utils/request";
import { CODE } from "../constant/cookie";
import { QUERY } from "../constant/query";
import { auth } from "../lib/auth";

export type UseLoginBody = Partial<
  StrictPick<User, "email" | "password"> & { remember: boolean }
>;

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/auth/login" });

  return useMutation({
    async mutationFn(body: UseLoginBody) {
      const res = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (res.ok) {
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
      }

      return res;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    async mutationFn() {
      const res = await request("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        navigate({ to: "/" });
      }

      return res;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });
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
    async mutationFn(body: UseOneTimePasswordBody) {
      const encryptedCode = Cookies.get(CODE);

      const res = await request("/api/auth/one-time-password", {
        method: "POST",
        body: JSON.stringify({
          email: search.email!,
          encrypted_code: encryptedCode,
          ...body,
        }),
      });

      if (res.ok) {
        navigate({ to: "/dashboard" });
        Cookies.remove(CODE);
      }

      return res;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: QUERY.AUTH.STATUS() });
    },
  });
}

export type UseForgetPasswordBody = StrictPick<User, "email">;

export function useForgetPassword() {
  const navigate = useNavigate({ from: "/auth/forget-password" });

  return useMutation({
    async mutationFn(body: UseForgetPasswordBody) {
      const res = await request("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        navigate({ to: "/auth/reset-password", search: { email: body.email } });
      }

      return res;
    },
  });
}

export type UseResetPasswordBody = StrictPick<User, "password"> & {
  password_confirmation: string;
} & { code: string };

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
    async mutationFn(body: UseResetPasswordBody) {
      const encryptedCode = Cookies.get(CODE);
      const res = await request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: search.email!,
          encrypted_code: encryptedCode,
          ...body,
        }),
      });

      if (res.ok) {
        navigate({ to: "/auth/login" });
        Cookies.remove(CODE);
      }

      return res;
    },
  });
}

export type UseAuthCallback = (user: User | null) => void | Promise<void>;

export function useAuth(callback?: UseAuthCallback) {
  const { data } = useQuery({
    queryKey: QUERY.AUTH.STATUS(),
    async queryFn(context) {
      const user = await auth({ signal: context.signal });
      await callback?.(user);
      return user;
    },
  });
  return data;
}
