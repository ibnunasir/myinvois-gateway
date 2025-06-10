# Configuring Document Signing

The MyInvois Gateway supports digitally signing documents before submission, as required for certain document types or scenarios in the MyInvois system (specifically for e-Invoice version 1.1). Document signing in the gateway relies on providing your private key and corresponding X.509 signing certificate.

## Required Credential Formats

Regardless of how you provide the credentials to the gateway, the content must adhere to these formats:

1.  **Private Key**: Your private key must be in **PKCS#8 PEM format** (unencrypted). This includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers/footers.
2.  **Signing Certificate**: Your signing certificate must be the **raw DER content, Base64 encoded**. This is *only* the Base64 string of the certificate's binary DER data, *without* any PEM headers/footers (e.g., `-----BEGIN CERTIFICATE-----`).

## Credential Loading Order

The gateway attempts to load the private key and signing certificate using the following order of precedence. The first successful method for each credential (key and certificate independently) will be used:

1.  **Explicit File Paths**: From files specified by the `SIGNING_PRIVATE_KEY_PATH` and `SIGNING_CERTIFICATE_PATH` environment variables.
2.  **Default File Paths**: If explicit path variables are not set or the specified files are not found, the gateway looks for files at default conventional paths relative to the project root (`myinvois-gateway/`):
    *   Private Key: `certs/private_key.pem`
    *   Certificate: `certs/certificate_base64.txt`
3.  **Direct Environment Variable Content**: If credentials are not successfully loaded from either explicit or default file paths, the gateway attempts to use the content directly from the `SIGNING_PRIVATE_KEY_PEM` and `SIGNING_CERTIFICATE_BASE64` environment variables.
4.  **Undefined (Fallback)**: If none of the above methods yield a credential, the configuration value for the missing item(s) will be `undefined`. Document signing will be unavailable, and a warning will be logged by the application during startup. Attempting to sign without fully configured credentials will result in an error.

## Configuring Credentials

You can configure your signing credentials using one of the methods described below. Choose the method that best suits your deployment strategy.

### Method 1: Explicit File Paths (Highest Priority)

Set these environment variables to point to the exact location of your credential files:

-   `SIGNING_PRIVATE_KEY_PATH`: Absolute or relative path to your PKCS#8 PEM private key file.
-   `SIGNING_CERTIFICATE_PATH`: Absolute or relative path to your file containing the Base64 encoded DER certificate.

**Example `.env` configuration:**

```env
# Method 1: Explicit File Paths
SIGNING_PRIVATE_KEY_PATH=/secure/path/to/my_private_key.pem
SIGNING_CERTIFICATE_PATH=/secure/path/to/my_certificate_base64.txt
```

### Method 2: Default File Paths (Recommended for Simplicity)

If you prefer a conventional setup without setting explicit path variables, you can place your credential files at these default locations within your `myinvois-gateway` project directory:

-   Private Key File: `myinvois-gateway/certs/private_key.pem`
-   Certificate File: `myinvois-gateway/certs/certificate_base64.txt`

Create the `certs` directory if it doesn't exist. If files are present at these default locations and the `SIGNING_PRIVATE_KEY_PATH` or `SIGNING_CERTIFICATE_PATH` variables are *not* set (or point to non-existent files), the gateway will automatically attempt to use these default files.

**Example file structure:**

```
myinvois-gateway/
├── certs/
│   ├── private_key.pem
│   └── certificate_base64.txt
├── src/
├── package.json
└── ... (other project files)
```

No specific `.env` lines are needed for `SIGNING_PRIVATE_KEY_PATH` or `SIGNING_CERTIFICATE_PATH` if you use this method and the files are correctly named and placed.

### Method 3: Direct Environment Variable Content (Fallback)

If credentials are not loaded via file paths (neither explicit nor default), you can provide the content directly in these environment variables:

-   `SIGNING_PRIVATE_KEY_PEM`: The full string content of your PKCS#8 PEM private key.
-   `SIGNING_CERTIFICATE_BASE64`: The Base64 encoded string of your raw DER certificate.

**Example `.env` configuration:**

```env
# Method 3: Direct Content
SIGNING_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\nMIIC8DCCAd...your key data...\n-----END PRIVATE KEY-----"
SIGNING_CERTIFICATE_BASE64="MIIClTCCAf4C...your base64 certificate data..."
```
**Note on multiline environment variables**: Ensure your environment variable system correctly handles multiline strings for `SIGNING_PRIVATE_KEY_PEM`. Often, replacing newlines with `\n` within a double-quoted string works.

## Important Considerations for Credential Content

-   **Private Key Content**:
    -   Must be in **PKCS#8 PEM format**. This includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers/footers.
    -   The key must be **unencrypted**. If your key is encrypted or in a different format (like PKCS#1), convert it first (see "Extracting Credentials from a .p12 File" below for PKCS#1 to PKCS#8 conversion).
-   **Certificate Content**:
    -   Must be the **Base64 string of the certificate's raw DER binary content**.
    -   Do **not** include `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` headers/footers if you are converting from a PEM certificate.

## Obtaining Your Signing Credentials

Your private key and signing certificate are typically generated and provided to you when you set up signing capabilities with the relevant authority or the MyInvois system itself. Consult the official MyInvois documentation or your Certification Authority (CA) for steps to obtain these. They might be provided as `.p12`, `.pfx`, `.pem`, `.key`, `.cer`, or `.crt` files.

## Converting Credential Formats (If Necessary)

You might need to convert your credentials into the required formats.

### Converting Certificate to Base64 Encoded DER

If your certificate is in PEM format (e.g., `my_cert.pem`), you need its Base64 encoded raw DER content.

1.  **Convert PEM to DER:**
    ```bash
    openssl x509 -in my_cert.pem -out my_cert.der -outform DER
    ```
2.  **Base64 Encode the DER file:**
    -   Linux/macOS:
        ```bash
        base64 < my_cert.der
        # or, to save to a file:
        base64 < my_cert.der > certificate_base64.txt
        ```
    -   Windows (PowerShell):
        ```powershell
        [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("my_cert.der"))
        # or, to save to a file:
        [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("my_cert.der")) | Set-Content -Path "certificate_base64.txt"
        ```
The resulting Base64 string is what you need. You can:
-   Save this string into the file `myinvois-gateway/certs/certificate_base64.txt` (for Method 2).
-   Save it to a custom file path and set `SIGNING_CERTIFICATE_PATH` (for Method 1).
-   Use the string directly as the value for `SIGNING_CERTIFICATE_BASE64` (for Method 3).

**Directly from PEM to Base64 DER (Linux/macOS):**
```bash
openssl x509 -in my_cert.pem -outform DER | base64
# To save to the default file:
# openssl x509 -in my_cert.pem -outform DER | base64 > certs/certificate_base64.txt
```

### Extracting Credentials from a .p12 / .pfx File

If your key and certificate are bundled in a PKCS#12 file (`.p12` or `.pfx`), you'll need `openssl` and the import password for the file.

1.  **Extract and Convert Private Key to PKCS#8 PEM:**
    a.  Extract the private key (often in PKCS#1 PEM format initially):
        ```bash
        openssl pkcs12 -in your_bundle.p12 -nocerts -nodes -out private_key_pkcs1.pem
        ```
        (Enter import password when prompted)
    b.  Convert PKCS#1 PEM to PKCS#8 PEM:
        ```bash
        openssl pkcs8 -topk8 -inform PEM -in private_key_pkcs1.pem -outform PEM -nocrypt -out private_key.pem
        ```
    The file `private_key.pem` now contains the required PKCS#8 PEM key.
    -   You can save/rename this file to `myinvois-gateway/certs/private_key.pem` (for Method 2).
    -   Or save it to a custom path and set `SIGNING_PRIVATE_KEY_PATH` (for Method 1).
    -   Or copy its content for `SIGNING_PRIVATE_KEY_PEM` (for Method 3).

2.  **Extract Certificate and Convert to Base64 DER:**
    a.  Extract the certificate (usually in PEM format):
        ```bash
        openssl pkcs12 -in your_bundle.p12 -clcerts -nokeys -out certificate.pem
        ```
        (Enter import password when prompted)
    b.  Follow the steps in "Converting Certificate to Base64 Encoded DER" above using `certificate.pem` as your input to get the Base64 DER string. Then use this string as appropriate for Method 1, 2, or 3 for the certificate.

## Using Signing in API Requests

Once the signing credentials are correctly configured using any of the described methods, you can trigger document signing for submission requests by including the `sign=true` query parameter in your API call (e.g., `/documents/invoices?sign=true`).

If the `sign` query parameter is omitted or set to `false`, the gateway will submit documents without adding the digital signature block.