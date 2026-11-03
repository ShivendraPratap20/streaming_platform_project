
import * as Yup from "yup";

const SignUpValidationSchema = Yup.object({
  userName: Yup.string()
    .min(5, "Name must be at least 5 characters")
    .max(30, "User name must be at most 30 characters long")
    .required("Name is required"),

  userID: Yup
    .string()
    .required("Enter valid userID"),

  email: Yup
    .string()
    .trim()
    .email('Please enter valid email')
    .max(254, 'Email cannot be exceed 254 characters')
    .transform((email) => email.toLowerCase()),

  phoneNumber: Yup.string()
    .min(10, "Phone Number must be of 10 digits")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, 'Password cannot exceed 128 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include letters, numbers, and special characters"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .required("Confirm the password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const SignInValidation = Yup.object({
  userID: Yup.string()
    .required("Enter valid userID"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

// Profile Update Validation Schema
const ProfileUpdateValidation = Yup.object({
  userName: Yup.string()
    .min(5, "Name must be at least 5 characters")
    .required("Name is required"),

  userID: Yup.string()
    .email("Invalid email")
    .required("Enter valid email address"),

  phoneNumber: Yup.string()
    .min(10, "Phone Number must be of 10 digits")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

// Infer TypeScript types from Yup schemas
type SignUpFormData = Yup.InferType<typeof SignUpValidationSchema>;
type SignInFormData = Yup.InferType<typeof SignInValidation>;
type ProfileUpdateFormData = Yup.InferType<typeof ProfileUpdateValidation>;

export {
  SignUpValidationSchema,
  SignInValidation,
  ProfileUpdateValidation,
};

export type {
  SignUpFormData,
  SignInFormData,
  ProfileUpdateFormData,
};
