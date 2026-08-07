import {z} from "zod";
import dotenv from "dotenv";

dotenv.config({
    path:".env"
})

function validateEnvironment(env: NodeJS.ProcessEnv ) {
    const envirnoment = z.object({
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        PORT: z.coerce.number().default(3000),
        DATABASE_URL: z.string(),
        BETTER_AUTH_URL: z.string(),
        BETTER_AUTH_SECRET: z.string(),
    })

    return envirnoment.parse(env)
}

console.log(process.env.PORT)

export const env = validateEnvironment(process.env)
