import { z } from "zod";

const smtpSchemaRequired = z.object( {
  DALERT_SMTP_HOST: z.string(),
  DALERT_SMTP_USER: z.string().email(),
  DALERT_SMTP_PASSWORD: z.string(),
  DALERT_SMTP_DEFAULT_TO: z.string().email(),
} );
const smtpSchema = smtpSchemaRequired.or(z.object( {} ));

export const envSchema = smtpSchema;

export function canMail(): boolean {
  return envSchema.safeParse(process.env).success;
}

export function assertCanMail(
  _ENVS: z.infer<typeof envSchema>,
): asserts _ENVS is z.infer<typeof smtpSchemaRequired> {
  if (!canMail())
    throw new Error("SMTP environment variables are not properly set");
}

export const ENVS: z.infer<typeof envSchema> = Object.freeze(
  envSchema.parse(process.env),
);
