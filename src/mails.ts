import * as nodemailer from "nodemailer";
import { assertCanMail, ENVS } from "./envs";

type Params = {
  to?: string;
  subject?: string;
  text?: string;
  html: string;
};

export async function sendMail( { html, text, subject, to }: Params) {
  assertCanMail(ENVS);

  const transporter = nodemailer.createTransport( {
    pool: true,
    host: ENVS.DALERT_SMTP_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: ENVS.DALERT_SMTP_USER,
      pass: ENVS.DALERT_SMTP_PASSWORD,
    },
  } );
  const message = {
    from: `Dalert Alarm <${ENVS.DALERT_SMTP_USER}>`,
    to: to ?? ENVS.DALERT_SMTP_DEFAULT_TO,
    subject: subject ?? `Dalert Alarm ${new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    } )}`,
    text,
    html,
  };
  const info = await transporter.sendMail(message);
  const { response } = info;

  if (!response.includes("success"))
    throw new Error(`Error sending email: ${JSON.stringify(info)}`);

  return info;
}

export function sendMailError(e: Error, ctx?: unknown) {
  let html = "<pre>";

  html += JSON.stringify(e, null, 2);

  if (ctx)
    html += "\nContext:\n" + JSON.stringify(ctx, null, 2);

  html += "</pre>";

  return sendMail( {
    html,
    subject: "Error in process",
  } );
}
