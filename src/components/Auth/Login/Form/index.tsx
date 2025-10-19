"use client";

import { useActionState, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/ui/custom/loading-button";
import { loginAction } from "@/actions/auth/login/login";
import { getFormSettings } from "@/utils/yup/client";
import { objectToFormData } from "@/utils/general/client";
import { useServerFormState } from "@/hooks/useServerFormState";
import { useToast } from "@/hooks/useToast";
import type { TState } from "@/types/general/server";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { LOGIN_DEFAULT_VALUES } from "@/constants/auth/client";
import { LoginFormValues } from "@/types/auth/client";

const LoginForm = () => {
  const [state, action] = useActionState<TState, FormData>(loginAction, null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>(
    getFormSettings({
      schema: loginSchema,
      defaultValues: LOGIN_DEFAULT_VALUES,
    })
  );

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      const formData = objectToFormData(data);
      startTransition(() => action(formData));
    },
    [action, startTransition]
  );

  useServerFormState(state, form);

  useToast(state);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" id="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  id="password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <LoadingButton loading={isPending} type="submit">
          Log In
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LoginForm;
