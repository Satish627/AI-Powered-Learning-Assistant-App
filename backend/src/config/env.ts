import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  CLIENT_ORIGIN: z.string().url("CLIENT_ORIGIN must be a valid URL"),
});

export const env = envSchema.parse(process.env);

export type AppEnv = typeof env;
