# Configuring Document Signing

The MyInvois Gateway supports digitally signing documents before submission, as required for certain document types or scenarios in the MyInvois system (specifically for e-Invoice version 1.1). Document signing in the gateway relies on providing your private key and corresponding X.509 signing certificate.

The gateway's signing logic, implemented using Node.js's `crypto.subtle` and `X509Certificate`, requires:

1.  Your **Private Key** in **PKCS#8 PEM format**.
2.  Your **Signing Certificate** in **raw DER format, Base64 encoded**. This is the base64 content of the DER certificate binary, *without* the `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` headers/footers.

These are configured via environment variables:

-   `SIGNING_PRIVATE_KEY_PEM`: Your private key in PKCS#8 PEM format.
-   `SIGNING_CERTIFICATE_BASE64`: Your signing certificate's raw DER content, Base64 encoded.

## Obtaining Your Signing Credentials

Your private key and signing certificate are typically generated and provided to you when you set up signing capabilities with the relevant authority or the MyInvois system itself.

You would usually download your certificate (often as a `.cer` or `.pfx` file, or sometimes provided as PEM text) and the associated private key (often as a `.key` or `.pfx` file, or PEM text).

Consult the official MyInvois documentation or the instructions provided by your Certification Authority (CA) for the exact steps to obtain these files.

## Configuring Environment Variables

You need to add the following environment variables to your gateway's configuration (e.g., your `.env` file or Docker environment variables).

```env
# Required for document signing
SIGNING_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----
... your PKCS#8 private key base64 content ...
-----END PRIVATE KEY-----"

SIGNING_CERTIFICATE_BASE64="your_certificate_raw_der_base64_content"
```

**Important Considerations:**

*   **`SIGNING_PRIVATE_KEY_PEM`**: This must be the full PEM block, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers and footers. If your private key is in a different format (like PKCS#1) or encrypted, you may need to convert it first. The gateway expects an unencrypted PKCS#8 PEM key.
*   **`SIGNING_CERTIFICATE_BASE64`**: This must be *only* the Base64 string of the certificate's DER binary content. Do *not* include the `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` headers/footers if you obtained it in PEM format.

## Converting Certificate Formats (If Necessary)

If your signing certificate is provided in PEM format, you will need to convert it to the raw DER Base64 format required by the `SIGNING_CERTIFICATE_BASE64` environment variable.

You can use the `openssl` command-line tool for this conversion.

**Converting PEM to DER:**

First, convert the PEM certificate to DER format:

```bash
openssl x509 -in your_certificate.pem -out your_certificate.der -outform DER
```

Replace `your_certificate.pem` with the path to your PEM formatted certificate file. This will create a binary DER file named `your_certificate.der`.

**Encoding DER to Base64:**

Next, encode the binary DER file content into a Base64 string.

*   **On Linux/macOS:**

    ```bash
    base64 < your_certificate.der
    # or
    openssl base64 -in your_certificate.der -out your_certificate.base64
    cat your_certificate.base64 # Display the base64 content
    ```

*   **On Windows (using PowerShell):**

    ```powershell
    [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("your_certificate.der"))
    ```

The output of these commands will be the Base64 string you need for the `SIGNING_CERTIFICATE_BASE64` environment variable.

**From PEM to Base64 (without intermediate file):**

You can also pipe the output:

*   **On Linux/macOS:**

    ```bash
    openssl x509 -in your_certificate.pem -outform DER | base64
    ```

Copy the resulting Base64 string and paste it as the value for `SIGNING_CERTIFICATE_BASE64` in your environment configuration.

## Extracting Credentials from a .p12 File (If Necessary)

If your signing credentials are provided in a `.p12` (PKCS#12) file, which bundles both the private key and certificate, you will need to extract them using `openssl`.

You'll likely need the password that protects the `.p12` file.

**1. Extract the Private Key (to PKCS#8 PEM):**

This command extracts the private key from the `.p12` file. The `-nodes` option means "no DES encryption", resulting in an unencrypted private key output. The `-outform PEM` specifies the output format. The result will typically be in PKCS#1 format initially, which then needs to be converted to PKCS#8.

```bash
openssl pkcs12 -in your_certificate.p12 -nocerts -nodes -out your_private_key.pem -outform PEM
```

Replace `your_certificate.p12` with the path to your `.p12` file. You will be prompted for the `.p12` import password. This creates `your_private_key.pem`.

Now, convert this private key (likely PKCS#1 PEM) to PKCS#8 PEM format, which the gateway expects:

```bash
openssl pkcs8 -in your_private_key.pem -topk8 -nocrypt -out your_private_key_pkcs8.pem
```

Replace `your_private_key.pem` with the file created in the previous step. This creates `your_private_key_pkcs8.pem`. The content of `your_private_key_pkcs8.pem` (including headers/footers) is what you should use for the `SIGNING_PRIVATE_KEY_PEM` environment variable.

**2. Extract the Certificate (to PEM):**

This command extracts the certificate(s) from the `.p12` file. The `-nokeys` option excludes the private key from the output.

```bash
openssl pkcs12 -in your_certificate.p12 -clcerts -nokeys -out your_certificate.pem
```

Replace `your_certificate.p12` with the path to your `.p12` file. You will be prompted for the `.p12` import password again. This creates `your_certificate.pem`.

**3. Convert the Certificate from PEM to DER Base64:**

Now that you have the certificate in PEM format (`your_certificate.pem`), follow the instructions in the "Converting Certificate Formats (If Necessary)" section above to convert it to the raw DER Base64 format required for the `SIGNING_CERTIFICATE_BASE64` environment variable.

## Using Signing in API Requests

Once the signing credentials (`SIGNING_PRIVATE_KEY_PEM` and `SIGNING_CERTIFICATE_BASE64`) are correctly configured in the gateway's environment, you can trigger document signing for submission requests by including the `sign=true` query parameter in your API call (e.g., `/documents/invoices?sign=true`).

If the `sign` query parameter is omitted or set to `false`, the gateway will submit documents without adding the digital signature block.