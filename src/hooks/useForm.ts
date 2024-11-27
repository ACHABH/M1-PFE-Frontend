import { type BaseSyntheticEvent, useCallback, useState } from "react";
import {
  type FieldValues,
  type UseFormProps,
  useForm as useReactHookForm,
} from "react-hook-form";
import { StrictOmit } from "../types";

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined
>(props: UseFormProps<TFieldValues, TContext>) {
  const [disabled, setDisabled] = useState(false);
  const form = useReactHookForm<TFieldValues, TContext, TTransformedValues>(props);

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
    [form]
  );

  return {
    ...(form as StrictOmit<typeof form, "handleSubmit">),
    onSubmit,
    disabled,
  };
}
