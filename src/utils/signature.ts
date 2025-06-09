import { type SignatureParams } from "myinvois-client";
import { subtle, X509Certificate as NodeX509Certificate } from "node:crypto";
import { CONFIG } from "src/config";

// Helper to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

// Helper to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const buffer = Buffer.from(base64, "base64");
  // Create a new ArrayBuffer that owns its memory, by slicing the underlying buffer.
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

/**
 * Converts the Base64 content of a PEM-encoded PKCS#8 private key string to an ArrayBuffer.
 * @param pemPkcs8Content The Base64 content of the PEM-encoded PKCS#8 private key (between headers/footers).
 * @returns The ArrayBuffer containing the DER-encoded key.
 */
function pkcs8PemContentToArrayBuffer(pemPkcs8Content: string): ArrayBuffer {
  const base64String = pemPkcs8Content.replace(/\s+/g, ""); // Remove all whitespace
  return base64ToArrayBuffer(base64String);
}

/**
 * Imports a PEM-encoded PKCS#8 private key string as a CryptoKey.
 * The key is configured for signing with RSASSA-PKCS1-v1_5 using SHA-256.
 * @param privateKeyPem The full PEM-encoded private key string (including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----).
 * @returns A Promise that resolves to the CryptoKey.
 * @throws Error if the key import fails or the PEM format is invalid.
 */
export async function importPrivateKey(
  privateKeyPem: string
): Promise<CryptoKey> {
  // Extract the Base64 content from the PEM string
  const pemMatch =
    /-----BEGIN PRIVATE KEY-----\s*([\s\S]+?)\s*-----END PRIVATE KEY-----/.exec(
      privateKeyPem
    );
  if (!pemMatch?.[1]) {
    throw new Error(
      "Invalid PEM private key format. Ensure it includes -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- and valid base64 content."
    );
  }
  const pkcs8Base64Content = pemMatch[1];
  const pkcs8ArrayBuffer = pkcs8PemContentToArrayBuffer(pkcs8Base64Content);

  try {
    const privateKey = await subtle.importKey(
      "pkcs8", // Format of the key to import
      pkcs8ArrayBuffer, // Key data as ArrayBuffer
      {
        name: "RSASSA-PKCS1-v1_5", // Algorithm identifier for RSA signing
        hash: "SHA-256", // Hash algorithm to use with the key
      },
      false, // `extractable` is false for private keys for security best practices
      ["sign"] // Key usages: this key can be used for signing
    );
    return privateKey;
  } catch (error) {
    console.error("Error importing private key:", error);
    // Augment the error message for better diagnostics
    throw new Error(
      `Failed to import private key: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Processes a base64 encoded X.509 certificate to extract its issuer name,
 * serial number, and calculate its SHA-256 digest.
 * The input certificateBase64 should be the raw base64 string of the DER-encoded certificate,
 * *without* PEM headers/footers (e.g., directly from CONFIG.signingCertificateBase64).
 * @param certificateBase64 The base64 encoded X.509 certificate string (raw DER content).
 * @returns A Promise resolving to an object containing issuerName, serialNumber, and certificateDigestBase64.
 * @throws Error if certificate processing fails.
 */
export async function processCertificate(certificateBase64: string): Promise<{
  issuerName: string;
  serialNumber: string;
  certificateDigestBase64: string;
}> {
  try {
    // The certificateBase64 is expected to be the pure base64 content of the DER certificate.
    const certificateDerBuffer = Buffer.from(certificateBase64, "base64");

    // Use Node.js crypto.X509Certificate for parsing certificate details
    const nodeCert = new NodeX509Certificate(certificateDerBuffer);

    // issuer (DN string) and serialNumber (hex string)
    const issuerName = nodeCert.issuer; // e.g., 'CN=Test CA,O=Org,C=US'
    const serialNumber = nodeCert.serialNumber; // Hexadecimal string

    // Calculate SHA-256 digest of the raw DER certificate for "CertDigest"
    // crypto.subtle.digest operates on ArrayBuffer.
    // Ensure we get a proper ArrayBuffer slice from the Node.js Buffer.
    const certificateArrayBuffer = certificateDerBuffer.buffer.slice(
      certificateDerBuffer.byteOffset,
      certificateDerBuffer.byteOffset + certificateDerBuffer.byteLength
    );
    const digestBuffer = await subtle.digest("SHA-256", certificateArrayBuffer);
    const certificateDigestBase64 = arrayBufferToBase64(digestBuffer);

    return {
      issuerName,
      serialNumber,
      certificateDigestBase64,
    };
  } catch (error) {
    console.error("Error processing certificate:", error);
    throw new Error(
      `Failed to process certificate: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Prepares the complete set of parameters required for generating a UBL digital signature.
 * It processes the private key and certificate, and combines them with the document
 * and other signature metadata.
 *
 * @param privateKeyPem The signer's private key in PEM format.
 * @param signingCertificateBase64 The signer's X.509 certificate, base64 encoded (raw DER content).
 * @param options Optional parameters to override default signature metadata.
 * @returns A Promise that resolves to an object conforming to the SignatureParams interface.
 */
export async function getSignatureParams(): Promise<SignatureParams> {
  const privateKeyPem = CONFIG.privateKeyPem;
  const signingCertificateBase64 = CONFIG.signingCertificateBase64;

  if (!privateKeyPem) {
    throw new Error("Private key configuration (privateKeyPem) is missing.");
  }

  if (!signingCertificateBase64) {
    throw new Error(
      "Signing certificate configuration (signingCertificateBase64) is missing."
    );
  }

  const privateKey = await importPrivateKey(privateKeyPem).catch((_e) => {
    throw new Error(
      "Invalid PEM private key format. Please check your configuration."
    );
  });

  const certDetails = await processCertificate(signingCertificateBase64);

  return {
    privateKey,
    signingCertificateBase64, // This is the raw base64 of the certificate itself
    certificateDigestBase64: certDetails.certificateDigestBase64,
    certificateIssuerName: certDetails.issuerName,
    certificateSerialNumber: certDetails.serialNumber,
    documentToSign: undefined,
  };
}
