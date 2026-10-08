import { z } from 'zod';

export const helpCategories = [
  'Medis & Darurat',
  'Sembako',
  'Peminjaman Alat',
  'Tenaga Relawan',
] as const;

export const helpRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Judul minimal 5 karakter' })
    .max(120, { message: 'Judul maksimal 120 karakter' }),
  description: z
    .string()
    .trim()
    .min(15, { message: 'Deskripsi minimal 15 karakter agar jelas' })
    .max(2000, { message: 'Deskripsi maksimal 2000 karakter' }),
  category: z.enum(helpCategories, {
    error: 'Pilih salah satu kategori bantuan yang valid',
  }),
  location: z
    .string()
    .trim()
    .min(3, { message: 'Lokasi/kota minimal 3 karakter' })
    .max(100, { message: 'Lokasi maksimal 100 karakter' }),
  contact: z
    .string()
    .trim()
    .min(5, { message: 'Kontak minimal 5 karakter (contoh: WhatsApp: 0812...)' })
    .max(150, { message: 'Kontak maksimal 150 karakter' }),
  website_honeypot: z.string().max(0, { message: 'Bot terdeteksi' }).optional(),
});

export type HelpRequestFormData = z.infer<typeof helpRequestSchema>;
