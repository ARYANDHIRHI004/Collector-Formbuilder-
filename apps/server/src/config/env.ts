import {z} from "zod";

import "dotenv/config"

function validateEnvironment(env: NodeJS.ProcessEnv ) {
    const envirnoment = z.object({
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        PORT: z.coerce.number().default(3000),
    })

    return envirnoment.parse(env)
}

export const env = validateEnvironment(process.env)
