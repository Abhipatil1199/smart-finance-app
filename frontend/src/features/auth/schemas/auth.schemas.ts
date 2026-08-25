import { z } from "zod";

/**
 * Letters (any script), marks, and the punctuation that legitimately appears
 * in names. Deliberately permissive about non-Latin scripts and deliberately
 * strict about digits and symbols.
 */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u;

const firstNameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your first name.")
  .max(60, "First name must be 60 characters or fewer.")
  .regex(NAME_PATTERN, "First name can only contain letters, spaces, hyphens and apostrophes.");

const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your last name.")
  .max(60, "Last name must be 60 characters or fewer.")
  .regex(NAME_PATTERN, "Last name can only contain letters, spaces, hyphens and apostrophes.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email address is required.")
  .max(254, "Email address is too long.")
  .pipe(z.email("Enter a valid email address, like name@example.com."));



/**
 * 10 characters rather than the usual 8: this guards money, and length buys
 * far more entropy than a longer list of character classes would.
 */
export const PASSWORD_MIN_LENGTH = 10;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  // bcrypt silently truncates past 72 bytes, so reject rather than mislead.
  .max(72, "Password must be 72 characters or fewer.")
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/\d/, "Include a number.")
  .regex(/[^A-Za-z0-9]/, "Include a symbol.");

export const signupSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,

    password: passwordSchema,
    // Confirm-password earns its place here: a typo in a password field the
    // user cannot read is unrecoverable without a reset-email round trip, and
    // signup is the one moment there is no existing password to fall back on.
    confirmPassword: z.string().min(1, "Please re-enter your password."),
    // Explicit consent is a regulatory requirement for a financial account,
    // and recording it client-side keeps the submit button honest.
    acceptTerms: z
      .boolean()
      .refine((value) => value, "Please accept the Terms and Privacy Policy to continue."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: emailSchema,
  // No complexity rules on sign-in. Echoing the policy back at an existing
  // user is noise, and it leaks the policy to anyone probing the form.
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

export type SignupFormInput = z.input<typeof signupSchema>;
export type SignupFormValues = z.output<typeof signupSchema>;
export type SigninFormInput = z.input<typeof signinSchema>;
export type SigninFormValues = z.output<typeof signinSchema>;

export const signupDefaultValues: SignupFormInput = {
  firstName: "",
  lastName: "",
  email: "",

  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const signinDefaultValues: SigninFormInput = {
  email: "",
  password: "",
  rememberMe: false,
};
