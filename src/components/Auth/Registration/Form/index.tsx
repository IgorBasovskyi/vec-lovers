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
import { getFormSettings } from "@/utils/yup/client";
import { objectToFormData } from "@/utils/general/client";
import { registerAction } from "@/actions/auth/register/register";
import { useServerFormState } from "@/hooks/useServerFormState";
import { useToast } from "@/hooks/useToast";
import { TState } from "@/types/general/server";
import { registerSchema } from "@/schemas/auth/registerSchema";
import { RegisterFormValues } from "@/types/auth/client";
import { REGISTRATION_DEFAULT_VALUES } from "@/constants/auth/client";

const RegisterForm = () => {
  const [state, action] = useActionState<TState, FormData>(
    registerAction,
    null
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>(
    getFormSettings({
      schema: registerSchema,
      defaultValues: REGISTRATION_DEFAULT_VALUES,
    })
  );

  const onSubmit = useCallback(
    async (data: RegisterFormValues) => {
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" id="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  id="confirmPassword"
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
          Register
        </LoadingButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
