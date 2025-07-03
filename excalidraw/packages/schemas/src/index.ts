import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(4, "too small for a username").max(10, "too big for a username"),
    password: z.string()
});

export const signupSchema = z.object({
    username: userSchema.shape.username,
    password: userSchema.shape.password
})

export const roomSchema = z.object({
    name: z.string()
})