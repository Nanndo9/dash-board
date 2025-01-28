import { z } from "zod";

export const createUserSchema = z.object({
                firstName: z.string({
                    required_error: 'First name must be a string',
                }).trim().min(1, {
                    message: 'First name must be at least 1 characters long',
                }),
                lastName: z.string().trim().min(1, {
                    message: 'Last name must be at least 1 characters long',
                }),
                email: z.string({
                    required_error: 'Email must be a string',
                }).email({
                    message: 'Invalid email format',
                }),
                password: z.string({
                    required_error: 'Password must be a string',

                }).trim().min(6, {
                    message: 'Password must be at least 6 characters long',
                }),
            });