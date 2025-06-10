import * as fs from "fs";
import type { MyInvoisEnvironment } from "myinvois-client";

interface Config {
  env: MyInvoisEnvironment;
  clientId: string;
  clientSecret: string;
  port: number;
  privateKeyPem?: string; // Made optional
  signingCertificateBase64?: string; // Made optional
}

const DEFAULT_PRIVATE_KEY_PATH = "certs/private_key.pem";
const DEFAULT_CERTIFICATE_PATH = "certs/certificate_base64.txt";

// Helper function to read file content
const readFileContent = (
  filePath: string | undefined,
  sourceDescription: string,
  isExplicitPath: boolean
): string | undefined => {
  if (!filePath) {
    return undefined;
  }

  try {
    if (!fs.existsSync(filePath)) {
      if (isExplicitPath) {
        // Only warn if an explicitly provided path is not found
        console.warn(
          "Warning: File not found for an explicitly provided path. Falling back."
        );
      }
      return undefined;
    }

    const content = fs.readFileSync(filePath, "utf8");
    // Log success if a file was successfully read
    if (isExplicitPath) {
      console.info("INFO: Successfully loaded credential from explicit path.");
    } else {
      // This is a default path
      console.info("INFO: Successfully loaded credential from default path.");
    }
    return content;
  } catch (error) {
    // Always warn on other read errors (e.g., permission issues for existing file)
    console.warn(
      `Warning: Could not read credential file. Error: ${(error as Error).message}. Falling back.`
    );
    return undefined;
  }
};

// --- Private Key Resolution ---
let finalPrivateKeyPem: string | undefined;

// 1. Try user-defined path from environment variable
const envPrivateKeyPath = process.env.SIGNING_PRIVATE_KEY_PATH;
if (envPrivateKeyPath) {
  finalPrivateKeyPem = readFileContent(
    envPrivateKeyPath,
    `SIGNING_PRIVATE_KEY_PATH env var ('${envPrivateKeyPath}')`,
    true // This is an explicit path
  );
}

// 2. If not found via user-defined path, try default path
finalPrivateKeyPem ??= readFileContent(
  DEFAULT_PRIVATE_KEY_PATH,
  `default path ('${DEFAULT_PRIVATE_KEY_PATH}')`,
  false // This is a default/conventional path
);

// 3. If still not found, try direct environment variable content
if (!finalPrivateKeyPem) {
  finalPrivateKeyPem = process.env.PRIVATE_KEY_PEM;
  if (finalPrivateKeyPem) {
    console.info(
      "INFO: Using private key from PRIVATE_KEY_PEM environment variable."
    );
  }
}

// 4. Warn if not configured
if (!finalPrivateKeyPem) {
  console.warn(
    "Warning: Signing private key is not configured (checked explicit path, default path, and direct env var PRIVATE_KEY_PEM). Document signing will be unavailable if attempted."
  );
}

// --- Signing Certificate Resolution ---
let finalSigningCertificateBase64: string | undefined;

// 1. Try user-defined path from environment variable
const envCertificatePath = process.env.SIGNING_CERTIFICATE_PATH;
if (envCertificatePath) {
  finalSigningCertificateBase64 = readFileContent(
    envCertificatePath,
    `SIGNING_CERTIFICATE_PATH env var ('${envCertificatePath}')`,
    true // This is an explicit path
  );
}

// 2. If not found via user-defined path, try default path
finalSigningCertificateBase64 ??= readFileContent(
  DEFAULT_CERTIFICATE_PATH,
  `default path ('${DEFAULT_CERTIFICATE_PATH}')`,
  false // This is a default/conventional path
);

// 3. If still not found, try direct environment variable content
if (!finalSigningCertificateBase64) {
  finalSigningCertificateBase64 = process.env.SIGNING_CERTIFICATE_BASE64;
  if (finalSigningCertificateBase64) {
    console.info(
      "INFO: Using signing certificate from SIGNING_CERTIFICATE_BASE64 environment variable."
    );
  }
}

// 4. Warn if not configured
if (!finalSigningCertificateBase64) {
  console.warn(
    "Warning: Signing certificate is not configured (checked explicit path, default path, and direct env var SIGNING_CERTIFICATE_BASE64). Document signing will be unavailable if attempted."
  );
}

export const CONFIG: Config = {
  env: (process.env.ENVIRONMENT ?? "SANDBOX") as MyInvoisEnvironment,
  clientId: process.env.CLIENT_ID ?? "YOUR_CLIENT_ID",
  clientSecret: process.env.CLIENT_SECRET ?? "YOUR_CLIENT_SECRET",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  privateKeyPem: finalPrivateKeyPem,
  signingCertificateBase64: finalSigningCertificateBase64,
};
