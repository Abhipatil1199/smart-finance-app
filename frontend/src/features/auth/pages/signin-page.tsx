import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

import { env } from "@/lib/env";
import { applyApiFieldErrors, getFormLevelError } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { StatusMessage } from "@/components/ui/status-message";
import { ROUTES } from "@/app/router/paths";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { useSigninMutation } from "@/features/auth/hooks/use-signin-mutation";
import {
  signinDefaultValues,
  signinSchema,
  type SigninFormInput,
  type SigninFormValues,
} from "@/features/auth/schemas/auth.schemas";

export function SigninPage() {
  const navigate = useNavigate();
  const signinMutation = useSigninMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    setFocus,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormInput, unknown, SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: signinDefaultValues,
    // First check on blur, then live on every keystroke. Validating from the
    // first keystroke would flag an email as invalid while it is being typed.
    mode: "onTouched",
  });

  const isBusy = isSubmitting || signinMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    signinMutation.mutate(
      { email: values.email, password: values.password, rememberMe: values.rememberMe },
      {
        onSuccess: () => navigate(ROUTES.dashboard, { replace: true }),
        onError: (error) => {
          const handled = applyApiFieldErrors(setError, error, ["email", "password"]);
          // Clear the rejected credential rather than leave it in the DOM,
          // and put the cursor where the retry starts.
          resetField("password");
          if (!handled) setFocus("password");
        },
      }
    );
  });

  // Field-level messages are rendered by their own field; only show the banner
  // for failures that have nowhere else to go.
  const formError = getFormLevelError(signinMutation.error);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New to Smart Finance?{" "}
          <Link
            to={ROUTES.signup}
            className="font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline dark:text-foreground"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate aria-busy={isBusy} className="flex flex-col gap-5">
        {formError ? <StatusMessage variant="error">{formError}</StatusMessage> : null}
        {signinMutation.isSuccess ? (
          <StatusMessage variant="success">Signed in. Taking you to your dashboard…</StatusMessage>
        ) : null}

        <FormField name="email" label="Email address" error={errors.email}>
          {(field) => (
            <Input
              {...field}
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="you@example.com"
              disabled={isBusy}
            />
          )}
        </FormField>

        <FormField
          name="password"
          label="Password"
          error={errors.password}
          action={
            <Link
              to={ROUTES.forgotPassword}
              className="text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline"
            >
              Forgot password?
            </Link>
          }
        >
          {(field) => (
            <PasswordInput
              {...field}
              {...register("password")}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isBusy}
            />
          )}
        </FormField>

        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <label className="flex w-fit cursor-pointer items-center gap-2.5 py-1 text-sm text-muted-foreground select-none">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                disabled={isBusy}
              />
              Keep me signed in
            </label>
          )}
        />

        <Button type="submit" size="xl" disabled={isBusy} className="mt-1 w-full">
          {isBusy ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </>
          )}
        </Button>

        {env.enableMockApi ? (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-center text-xs leading-relaxed text-muted-foreground">
            Demo mode — no backend required. Sign in with{" "}
            <span className="font-medium text-foreground">demo@smartfinance.app</span> /{" "}
            <span className="font-medium text-foreground">Password@123</span>
          </p>
        ) : null}
      </form>
    </AuthLayout>
  );
}

export default SigninPage;
