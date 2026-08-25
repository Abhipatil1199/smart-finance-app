import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon, CircleCheckBigIcon } from "lucide-react";

import { applyApiFieldErrors, getFormLevelError } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { StatusMessage } from "@/components/ui/status-message";
import { ROUTES } from "@/app/router/paths";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { PasswordStrengthMeter } from "@/features/auth/components/password-strength-meter";
import { useSignupMutation } from "@/features/auth/hooks/use-signup-mutation";
import {
  PASSWORD_MIN_LENGTH,
  signupDefaultValues,
  signupSchema,
  type SignupFormInput,
  type SignupFormValues,
} from "@/features/auth/schemas/auth.schemas";

/**
 * Subscribes to the password field on its own so keystrokes re-render the
 * meter instead of the whole form.
 */
function LivePasswordStrength({ control }: { control: Control<SignupFormInput> }) {
  const password = useWatch({ control, name: "password" });
  return <PasswordStrengthMeter value={password ?? ""} className="mt-0.5" />;
}

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput, unknown, SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaultValues,
    mode: "onTouched",
    // Report every unmet password rule at once rather than one per attempt.
    criteriaMode: "all",
  });

  const isBusy = isSubmitting || signupMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    signupMutation.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      },
      {
        onError: (error) => {
          const handled = applyApiFieldErrors(setError, error, [
            "firstName",
            "lastName",
            "email",
            "password",
          ]);
          if (handled) setFocus("email");
        },
      }
    );
  });

  const formError = getFormLevelError(signupMutation.error);

  if (signupMutation.isSuccess) {
    const { user } = signupMutation.data;
    return (
      <AuthLayout
        title="You're all set"
        subtitle={`Welcome to Smart Finance, ${user.firstName}.`}
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-success/12 text-success">
            <CircleCheckBigIcon aria-hidden="true" className="size-7" />
          </span>
          <div role="status" className="flex flex-col gap-1.5">
            <p className="font-medium text-foreground">Your account is ready</p>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              Your account has been created with{" "}
              <span className="font-medium text-foreground">{user.email}</span>.
              Sign in to get started.
            </p>
          </div>
          <Button
            type="button"
            size="xl"
            autoFocus
            onClick={() => navigate(ROUTES.signin, { replace: true })}
            className="w-full"
          >
            Continue to sign in
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up Smart Finance in under a minute. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={ROUTES.signin}
            className="font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline dark:text-foreground"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate aria-busy={isBusy} className="flex flex-col gap-5">
        {formError ? <StatusMessage variant="error">{formError}</StatusMessage> : null}

        <div className="flex gap-4">
          <FormField name="firstName" label="First name" error={errors.firstName} className="flex-1">
            {(field) => (
              <Input
                {...field}
                {...register("firstName")}
                type="text"
                autoComplete="given-name"
                autoCapitalize="words"
                placeholder="Ada"
                disabled={isBusy}
              />
            )}
          </FormField>
          <FormField name="lastName" label="Last name" error={errors.lastName} className="flex-1">
            {(field) => (
              <Input
                {...field}
                {...register("lastName")}
                type="text"
                autoComplete="family-name"
                autoCapitalize="words"
                placeholder="Sterling"
                disabled={isBusy}
              />
            )}
          </FormField>
        </div>

        <FormField name="email" label="Email address" error={errors.email}>
          {(field) => (
            <Input
              {...field}
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
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
          description={`At least ${PASSWORD_MIN_LENGTH} characters, with a number and a symbol.`}
        >
          {(field) => (
            <>
              <PasswordInput
                {...field}
                {...register("password")}
                autoComplete="new-password"
                placeholder="Create a strong password"
                disabled={isBusy}
              />
              <LivePasswordStrength control={control} />
            </>
          )}
        </FormField>

        <FormField name="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
          {(field) => (
            <PasswordInput
              {...field}
              {...register("confirmPassword")}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              disabled={isBusy}
            />
          )}
        </FormField>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <label className="flex w-fit cursor-pointer items-start gap-3 py-1 text-sm leading-snug text-muted-foreground select-none">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  aria-invalid={fieldState.error ? true : undefined}
                  disabled={isBusy}
                  className="mt-0.5"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="/legal/terms"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/legal/privacy"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {fieldState.error ? <FieldError>{fieldState.error.message}</FieldError> : null}
            </Field>
          )}
        />

        <Button type="submit" size="xl" disabled={isBusy} className="mt-1 w-full">
          {isBusy ? (
            <>
              <Spinner />
              Creating your account…
            </>
          ) : (
            <>
              Create account
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;
