'use client';

import { useActionState, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LoadingButton } from '@/components/ui/custom/loading-button';
import { getFormSettings } from '@/utils/yup/client';
import { objectToFormData } from '@/utils/general/client';
import { registerAction } from '@/actions/auth/register/register';
import { useServerFormState } from '@/hooks/useServerFormState';
import { useToast } from '@/hooks/useToast';
import { TState } from '@/types/general/server';
import { registerSchema } from '@/schemas/auth/registerSchema';
import { RegisterFormValues } from '@/types/auth/client';
import {
  AUTH_BUTTON_LABELS,
  REGISTRATION_DEFAULT_VALUES,
  AUTH_INPUT_PLACEHOLDERS,
  AUTH_FIELDS,
} from '@/constants/auth/client';

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
          name={AUTH_FIELDS.username as keyof RegisterFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder={AUTH_INPUT_PLACEHOLDERS.username}
                  id={AUTH_FIELDS.username}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={AUTH_FIELDS.email as keyof RegisterFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder={AUTH_INPUT_PLACEHOLDERS.email}
                  id={AUTH_FIELDS.email}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={AUTH_FIELDS.password as keyof RegisterFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder={AUTH_INPUT_PLACEHOLDERS.password}
                  id={AUTH_FIELDS.password}
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
          name={AUTH_FIELDS.confirmPassword as keyof RegisterFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder={AUTH_INPUT_PLACEHOLDERS.confirmPassword}
                  id={AUTH_FIELDS.confirmPassword}
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
          {AUTH_BUTTON_LABELS.register}
        </LoadingButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
