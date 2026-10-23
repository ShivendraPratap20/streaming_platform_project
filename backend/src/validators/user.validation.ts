
import { z } from 'zod';

const userSignupSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(5, 'User name must be at least 5 characters long')
    .max(30, 'User name must be at most 30 characters long'),

  userID: z
    .string()
    .trim()
    .min(1, 'User ID is required'),

  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email cannot exceed 254 characters')
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot exceed 128 characters'),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be a 10-digit number')
    .optional(),

  profilePicture: z
    .string()
    .trim()
    .url('Profile picture must be a valid URL')
    .nullable()
    .optional(),

  accountType: z
    .enum(['USER', 'CREATOR'])
    .default('USER'),

  authorizationType: z
    .enum(['EMAIL', 'GOOGLEAUTH'])
    .default('EMAIL'),
}).strict();

const userLoginSchema = z.object({
  userID: z
    .string()
    .trim(),
  password: z
    .string(),
});

const userUpdateSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(5, 'User name must be at least 5 characters long')
    .max(30, 'User name must be at most 30 characters long')
    .optional(),

  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email cannot exceed 254 characters')
    .transform((email) => email.toLowerCase())
    .optional(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter,  one lowercase letter, one number, and one special character')
    .optional(),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be a 10-digit number')
    .optional(),

  profilePicture: z
    .string()
    .trim()
    .url('Profile picture must be a valid URL')
    .nullable()
    .optional(),
}).strict();

export type UserSignupInput = z.infer<typeof userSignupSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export { userSignupSchema, userLoginSchema, userUpdateSchema };