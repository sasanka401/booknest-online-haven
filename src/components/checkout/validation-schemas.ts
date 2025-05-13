
import * as z from "zod";

// Separate schemas for shipping and payment
export const shippingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Full name must contain only letters" }),
  phoneNumber: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" })
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
    .length(6, { message: "PIN code must be exactly 6 digits" })
    .regex(/^[0-9]+$/, { message: "PIN code must contain only digits" }),
});

export const paymentSchema = z.object({
  cardName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters" })
    .optional()
    .or(z.literal('')),
  cardNumber: z
    .string()
    .length(16, { message: "Card number must be exactly 16 digits" })
    .regex(/^[0-9]+$/, { message: "Card number must contain only digits" })
    .optional()
    .or(z.literal('')),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Expiry date must be in MM/YY format" })
    .optional()
    .or(z.literal('')),
  cvv: z
    .string()
    .length(3, { message: "CVV must be exactly 3 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" })
    .optional()
    .or(z.literal('')),
  paymentMethod: z.string(),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
