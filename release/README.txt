MyInvois Gateway - Setup and Usage

1. Configure Environment Variables:
   - Rename ".env.example" (included in this archive) to ".env" in the same directory as the executable.
   - Edit the ".env" file with your specific configurations:
     - CLIENT_ID (Required)
     - CLIENT_SECRET (Required)
     - REDIS_URL (Optional, for caching. Example: redis://localhost:6379)
     - GATEWAY_API_KEY (Optional, if you want to protect the gateway itself with an API key)
     - PRIVATE_KEY_PEM_PATH (Optional, path to your private key PEM file for document signing)
     - SIGNING_CERTIFICATE_BASE64_PATH (Optional, path to your signing certificate PEM file, base64 encoded, for document signing)
     - Or set PRIVATE_KEY_PEM and SIGNING_CERTIFICATE_BASE64 directly as environment variables.

2. Run the Application:
   - Ensure the "public" directory (included in this archive) is in the same directory as the executable.
   - For Linux: Open a terminal in this directory and run: ./myinvois-gateway
   - For Windows: Open a command prompt or PowerShell in this directory and run: .\\myinvois-gateway.exe

3. Accessing the Gateway:
   - The gateway will typically run on http://localhost:8801 (or the port configured via PORT in .env).
   - API documentation will be available at /docs/api on the running server.
   - The gateway serves static content from the "public" directory (e.g., the welcome page at /).

For more details on configuration options, please refer to the main project documentation.