import type { MyInvoisEnvironment } from "myinvois-client";

interface Config {
  env: MyInvoisEnvironment;
  clientId: string;
  clientSecret: string;
  port: number;
  privateKeyPem: string; // Added for the private key
  signingCertificateBase64: string; // Added for the signing certificate
}

export const CONFIG: Config = {
  env: (process.env.ENVIRONMENT ?? "SANDBOX") as MyInvoisEnvironment,
  clientId: process.env.CLIENT_ID ?? "YOUR_CLIENT_ID",
  clientSecret: process.env.CLIENT_SECRET ?? "YOUR_CLIENT_SECRET",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  privateKeyPem: process.env.PRIVATE_KEY_PEM ?? "YOUR_PRIVATE_KEY_PEM_STRING",
  signingCertificateBase64:
    process.env.SIGNING_CERTIFICATE_BASE64 ?? "YOUR_CERTIFICATE_BASE64_STRING",
};
