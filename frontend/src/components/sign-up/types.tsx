import * as z from 'zod';

export type PersonalDataTypes = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

export const personalDetailsSchema = z
  .object({
    username: z.string().min(4, 'Name is required').max(20),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

export type RoleDataTypes = {
  role: number;
};

export const roleDataSchema = z.object({
  role: z.number().min(1, 'Role is required').max(5, 'Role is required'),
});

export type SocialDataTypes = {
  social_twitter: string;
  social_telegram: string;
  social_instagram: string;
  social_discord: string;
};

export const socialDetailsSchema = z.object({
  twitter: z
    .string()
    .min(3, 'Twitter username must be at least 3 characters')
    .optional(),
  instagram: z
    .string()
    .min(3, 'Instagram username must be at least 3 characters')
    .optional(),
  discord: z
    .string()
    .min(3, 'Discord username must be at least 3 characters')
    .optional(),
  telegram: z
    .string()
    .min(3, 'Telegram username must be at least 3 characters')
    .optional(),
});

export type ProjectDataTypes = {
  project_name: string;
  project_website: string;
  project_telegram: string;
  project_twitter: string;
  project_instagram: string;
  project_discord: string;
  project_logo: string;
};

export const projectDetailsSchema = z
  .object({
    project_name: z.string().min(1, 'Project name is required'),
    project_website: z
      .string()
      .url('Invalid URL format')
      .min(1, 'Project website is required'),
    project_telegram: z
      .string()
      .min(3, 'Telegram username must be at least 3 characters')
      .optional(),
    project_twitter: z
      .string()
      .min(3, 'Twitter username must be at least 3 characters')
      .optional(),
    project_instagram: z
      .string()
      .min(3, 'Instagram username must be at least 3 characters')
      .optional(),
    project_discord: z
      .string()
      .min(3, 'Discord username must be at least 3 characters')
      .optional(),
    project_logo: z
      .string()
      .url('Invalid URL format')
      .min(1, 'Project logo is required'),
  })
  .refine(
    data => {
      return (
        data.project_telegram ||
        data.project_twitter ||
        data.project_instagram ||
        data.project_discord
      );
    },
    {
      message:
        'At least one social media contact (Telegram, Twitter, Instagram, or Discord) is required',
      path: [
        'project_telegram',
        'project_twitter',
        'project_instagram',
        'project_discord',
      ],
    }
  );
