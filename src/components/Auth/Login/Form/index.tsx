"use client";

import { useActionState, useTransition } from "react";
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
import { loginAction } from "@/actions/auth/login";
import { getFormSettings } from "@/utils/yup/client";
import { objectToFormData } from "@/utils/general/client";
import { loginSchema } from "@/schemas/userSchema";
import { useServerFormState } from "@/hooks/useServerFormState";
import { useServerRedirect } from "@/hooks/useServerRedirect";
import { useToast } from "@/hooks/useToast";
import type { TState } from "@/types/auth/server";
import type { InferType } from "yup";

type LoginFormValues = InferType<typeof loginSchema>;

const DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [state, action] = useActionState<TState, FormData>(loginAction, null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>(
    getFormSettings({ schema: loginSchema, defaultValues: DEFAULT_VALUES })
  );

  const onSubmit = (data: LoginFormValues) => {
    const formData = objectToFormData(data);
    startTransition(() => action(formData));
  };

  useServerFormState(state, form);

  useToast(state);

  useServerRedirect(state);

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
