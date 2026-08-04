import z from "zod";

export const createUserSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
    username: z.string().nonempty(),
})