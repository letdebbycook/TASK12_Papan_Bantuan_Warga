import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Format alamat email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Kata sandi minimal 8 karakter' })
    .max(100, { message: 'Kata sandi maksimal 100 karakter' }),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Nama lengkap minimal 3 karakter' })
    .max(80, { message: 'Nama lengkap maksimal 80 karakter' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Format alamat email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Kata sandi minimal 8 karakter' })
    .max(100, { message: 'Kata sandi maksimal 100 karakter' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Konfirmasi kata sandi minimal 8 karakter' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
