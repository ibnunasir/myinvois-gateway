# MyInvois Gateway (Docker Image)

This Docker image runs the MyInvois Gateway.

## License

This software is licensed under the GNU General Public License v3.0 (GPLv3).
A copy of the license (`LICENSE.md`) is included alongside this file.
The full license text can also be found at: https://www.gnu.org/licenses/gpl-3.0.html

## Source Code

The canonical source code for MyInvois Gateway is available at:
[myinvois-gateway](https://github.com/farhan-syah/myinvois-gateway)

## Basic Usage

To run this image (assuming `farhansyah/myinvois-gateway` is the image name, replace if using a locally built name):

```bash
docker run -d \
  -e CLIENT_ID="your_client_id_here" \
  -e CLIENT_SECRET="your_client_secret_here" \
  -e GATEWAY_API_KEY="your_gateway_api_key_here" \ # Optional
  -e REDIS_URL="redis://<your_redis_host>:<your_redis_port>" \ # Optional
  # -e SIGNING_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\n# ... your PKCS#8 private key base64 content ...\n# -----END PRIVATE KEY-----" # Optional; Required for e-Invoice v1.1 signing \
  # -e SIGNING_CERTIFICATE_BASE64="your_certificate_raw_der_base64_content" # Optional; Required for e-Invoice v1.1 signing \
  -p 3000:3000 \
  --name myinvois_gateway \
  farhansyah/myinvois-gateway
```

Remember to replace placeholder values for `CLIENT_ID` and `CLIENT_SECRET`.
The application will be available at `http://localhost:3000`.

## API Documentation

Once the application is running, API documentation (Swagger UI) can be accessed at:
`http://localhost:3000/docs/api`

For more detailed setup, development, and contribution information, please refer to the main `README.md` in the source code repository linked above.
