const { z } = require("zod");

const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const addressSchema = z
  .string({ required_error: "Address is required" })
  .trim()
  .min(1, "Address is required")
  .max(400, "Address must be at most 400 characters");

const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .email("Enter a valid email address")
  .max(255);

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be 8 to 16 characters")
  .max(16, "Password must be 8 to 16 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must include at least one special character (!@#$%^&*(),.?":{}|<>)'
  );

const roleSchema = z.enum(["ADMIN", "USER", "STORE_OWNER"]);

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: roleSchema,
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.coerce.number().int().positive("Store owner is required"),
});

const ratingValueSchema = z.object({
  rating: z.coerce
    .number({ required_error: "Rating is required" })
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
});

const submitRatingSchema = ratingValueSchema.extend({
  storeId: z.coerce.number().int().positive("Store is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  createUserSchema,
  createStoreSchema,
  ratingValueSchema,
  submitRatingSchema,
};
