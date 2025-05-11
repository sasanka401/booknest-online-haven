
import * as z from "zod";

// Separate schemas for shipping and payment
export const shippingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Full name must contain only letters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only numbers" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "City must contain only letters" }),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "State must contain only letters" }),
  pinCode: z
    .string()
    .min(5, { message: "PIN code must be at least 5 digits" })
    .max(6, { message: "PIN code cannot exceed 6 digits" })
    .regex(/^[0-9]+$/, { message: "PIN code must contain only digits" }),
});

export const paymentSchema = z.object({
  cardName: z.string().min(2, { message: "Name on card must be at least 2 characters" }),
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(16),
  expiryDate: z.string().min(5, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string().min(3, { message: "CVV must be at least 3 digits" }).max(4),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
