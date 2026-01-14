import { z } from "zod";
const envSchema = z.object({
    DATABASE_URL: z.string().nonempty(),
    JWT_SECRECT: z.string().nonempty()
});
// export const env = envSchema.parse(process.env)
//# sourceMappingURL=env.js.map