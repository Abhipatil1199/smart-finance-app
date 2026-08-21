import { z } from "zod";

import { countDigits, normalizePhone } from "@/lib/sanitize";

/**
 * Letters (any script), marks, and the punctuation that legitimately appears
 * in names. Deliberately permissive about non-Latin scripts and deliberately
 * strict about digits and symbols.
 */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u;

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(60, "Name must be 60 characters or fewer.")
  .regex(NAME_PATTERN, "Name can only contain letters, spaces, hyphens and apostrophes.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email address is required.")
  .max(254, "Email address is too long.")
  .pipe(z.email("Enter a valid email address, like name@example.com."));

/**
 * Accepts the separators people actually type — `+44 20 7946 0958`,
 * `(415) 555-0142` — then checks the digit count against the E.164 range
 * (up to 15 digits, with 8 as a practical floor for a mobile number).
 * The value is stored as typed; `normalizePhone` converts it at the API edge.
 */
const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required.")
  .regex(/^\+?[\d\s().-]+$/, "Phone number can only contain digits, spaces and + ( ) - .")
  .refine((value) => {
    const digits = countDigits(normalizePhone(value));
    return digits >= 8 && digits <= 15;
  }, "Enter a valid phone number with 8 to 15 digits. Include your country code, e.g. +14155550142.");

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
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
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
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const signinDefaultValues: SigninFormInput = {
  email: "",
  password: "",
  rememberMe: false,
};
