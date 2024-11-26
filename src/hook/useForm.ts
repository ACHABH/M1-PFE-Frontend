import { type BaseSyntheticEvent, useCallback, useState } from "react";
import {
  type FieldValues,
  type UseFormProps,
  useForm as useReactHookForm,
} from "react-hook-form";
import { StrictOmit } from "../types";

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(props: UseFormProps<TFieldValues, TContext>) {
  const [disbaled, setDisabled] = useState(false);
  const form = useReactHookForm(props);

  const onSubmit = useCallback(
    (...args: Parameters<typeof form.handleSubmit>) => {
      return async (e: BaseSyntheticEvent) => {
        setDisabled(true);
        try {
          await form.handleSubmit(...args)(e);
        } catch (error) {
          form.setError("root", {
            message: error instanceof Error ? error.message : `${error}`,
          });
        } finally {
          setDisabled(false);
        }
      };
    },
    []
  );

  return {
    ...(form as StrictOmit<typeof form, "handleSubmit">),
    onSubmit,
    disbaled,
  };
}
