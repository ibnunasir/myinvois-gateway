[![License: LGPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# MyInvois Gateway

## Overview

The MyInvois Gateway handles the submission of new MyInvois documents, significantly simplifying the document submission process compared to interacting directly with the official MyInvois API. Instead of requiring complex, Base64-encoded UBL (XML or JSON), you can submit document data using a developer-friendly, standard JSON structure.

The gateway, powered by the [myinvois-client](https://github.com/farhan-syah/myinvois-client) library, takes care of:

1.  Translating your simple JSON input into the required UBL format.
2.  Calculating document hashes.
3.  Base64 encoding the UBL.
4.  Formatting the request payload for the official API.
5.  Handling document signing.
6.  Supporting caching through Redis (if configured).

Use this gateway to easily submit invoices, credit notes, or debit notes from any application capable of making standard HTTP POST requests with a JSON body.

## Features

- **Simplified Document Submission:** Submit documents using a standard JSON structure instead of complex UBL.
- **Automatic UBL Translation:** Converts JSON input to the required UBL format.
- **Automated Hashing & Encoding:** Handles document hash calculation and Base64 encoding.
- **Official API Formatting:** Prepares the payload for the official MyInvois API.
- **Document Signing:** Manages the document signing process.
- **Optional Redis Caching:** Improves performance and reliability by caching responses.
- **Developer-Friendly API Docs:** Interactive API documentation available via Swagger UI.

The API documentation (Swagger UI) is available at `/docs/api` when the application is running.

## Prerequisites

- **Bun:** For local development and building. (Installation: [https://bun.sh/docs/installation](https://bun.sh/docs/installation))
- **Docker & Docker Compose:** For running the application in containers. (Installation: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))
- **Git:** For cloning the repository.

## Environment Variables

This application requires the following environment variables:

- `CLIENT_ID`: Your MyInvois Client ID.
- `CLIENT_SECRET`: Your MyInvois Client Secret.
- `GATEWAY_API_KEY` (Optional): An API key you can define to protect access to the gateway. If provided, this key must be sent in the `X-API-KEY` header for all requests to the gateway. If not set, the gateway will be accessible without an API key (not recommended for production or publicly accessible instances).
- `REDIS_URL` (Optional): The connection URL for Redis (e.g., `redis://localhost:6379` for local development, or `redis://redis:6379` when using Docker Compose). If not provided, the application will run without Redis caching.
- `SIGNING_PRIVATE_KEY_PEM`: Your private key in PKCS#8 PEM format (optional; required for e-Invoice v1.1 signing).
- `SIGNING_CERTIFICATE_BASE64`: Your signing certificate's raw DER content, Base64 encoded (optional; required for e-Invoice v1.1 signing).

**Setup:**

Create a `.env` file in the root of the project (`myinvois-gateway/.env`) and add your credentials:

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
# GATEWAY_API_KEY=your_gateway_api_key_here # Optional: Define to secure the gateway. If omitted, the gateway will be unprotected.
# REDIS_URL=redis://localhost:6379 # Optional: for local Bun development if using local Redis

# Required for document signing (e-Invoice v1.1)
# SIGNING_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\n# ... your PKCS#8 private key base64 content ...\n# -----END PRIVATE KEY-----"
# SIGNING_CERTIFICATE_BASE64="your_certificate_raw_der_base64_content"
```

This `.env` file will be automatically used by `bun run dev`, when running the compiled binary locally (if your application loads it, typically via a library like `dotenv` which Bun might handle implicitly for `process.env`), and by Docker Compose if it's in the same directory.

## Document Signing Configuration

To enable document signing (required for e-Invoice v1.1), you need to provide your private key and signing certificate via environment variables. Detailed instructions on how to configure signing, including required formats and how to convert credentials from `.p12` files, can be found in:

- [instructions/adding_signature.md](instructions/adding_signature.md)

Please refer to this file for necessary environment variables (`SIGNING_PRIVATE_KEY_PEM` and `SIGNING_CERTIFICATE_BASE64`) and guidance on preparing your key and certificate.

## Running the Application

You can run the application in several ways:

### 1. Local Development (using Bun)

This method uses Bun to run the application directly from the source code with hot-reloading.

1.  **Install dependencies:**
    ```bash
    bun install
    ```
2.  **Set environment variables:** Ensure your `.env` file in the project root is configured, or set the environment variables directly in your shell. If using local Redis, make sure `REDIS_URL` points to it (e.g., `redis://localhost:6379`).
3.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application will typically be available at `http://localhost:3000`.

### 2. Local Production Build (Binary)

This method compiles the application into a standalone executable using Bun, which you can then run.

1.  **Install dependencies:**
    ```bash
    bun install
    ```
2.  **Set environment variables:** Ensure your `.env` file is configured or set them in your shell.
3.  **Build the application:**
    ```bash
    bun run build
    ```
    This will create an executable file named `server` in the project root.
4.  **Run the executable:**
    ```bash
    # Make sure environment variables are set in your current shell
    # or that the application loads them from .env
    ./server
    ```
    The application will be available at `http://localhost:3000`.

### 3. Using Docker

This method involves running the application as a Docker container. You can either pull a pre-built image from Docker Hub or build it locally.

**Option A: Pull from Docker Hub (Recommended for quick start)**

You can use the pre-built image available on Docker Hub:

```bash
docker pull farhansyah/myinvois-gateway
```

Then, skip to step 2 (Run the Docker container), ensuring you use `farhansyah/myinvois-gateway` as the image name in the `docker run` command.

**Option B: Build the Docker image locally**

1.  **Build the Docker image:**
    From the project root (`myinvois-gateway/`), run:

    ```bash
    docker build -t myinvois-gateway .
    ```

    (If using `docker buildx` and you want to load it directly into your local images: `docker buildx build -t myinvois-gateway --load .`)

2.  **Run the Docker container:**
    If you pulled the image from Docker Hub, use `farhansyah/myinvois-gateway` as the image name. If you built it locally, use `myinvois-gateway`.

    #### From Local Image

    ```bash
    # Example for locally built image:
    docker run -d \
      -e CLIENT_ID="your_client_id_here" \
      -e CLIENT_SECRET="your_client_secret_here" \
      # -e GATEWAY_API_KEY="your_gateway_api_key_here" \ # Optional: Define to secure the gateway
      -e REDIS_URL="redis://<your_redis_host>:<your_redis_port>" \ # Optional: for Redis caching
      -p 3000:3000 \
      --name myinvois_gateway \
      myinvois-gateway
    ```

    #### From Docker Hub Image

    ```bash
    Example for Docker Hub image:
    docker run -d \
      -e CLIENT_ID="your_client_id_here" \
      -e CLIENT_SECRET="your_client_secret_here" \
      # -e GATEWAY_API_KEY="your_gateway_api_key_here" \ # Optional: Define to secure the gateway
      -e REDIS_URL="redis://<your_redis_host>:<your_redis_port>" \ # Optional: for Redis caching
      -p 3000:3000 \
      --name myinvois_gateway \
      farhansyah/myinvois-gateway
    ```

    - Replace placeholder values for `CLIENT_ID` and `CLIENT_SECRET`.
    - If you are using a `GATEWAY_API_KEY`, uncomment and set that line.
    - The `-d` flag runs the container in detached mode.
    - Access the application at `http://localhost:3000`.
    - To see logs: `docker logs myinvois_gateway`
    - To stop: `docker stop myinvois_gateway`
    - To remove: `docker rm myinvois_gateway`

### 4. Using Docker Compose

This is the recommended method for a consistent development and testing environment, as it manages both the application and Redis services.

1.  **Ensure Docker Compose is installed.**
2.  **Create/Verify `.env` file:** Make sure you have a `.env` file in the project root (`myinvois-gateway/.env`) with your `CLIENT_ID` and `CLIENT_SECRET`. The `GATEWAY_API_KEY` is optional; if you choose to use one, add it here. The `REDIS_URL` will be handled by Docker Compose to point to its own Redis service.
    ```env
    CLIENT_ID=your_client_id_here
    CLIENT_SECRET=your_client_secret_here
    # GATEWAY_API_KEY=your_gateway_api_key_here # Optional: Define to secure the gateway
    ```
3.  **Run Docker Compose:**
    Navigate to the project root (`myinvois-gateway/`) where `docker-compose.yml` is located.

    To build images (if necessary) and start services:

    ```bash
    docker compose up --build
    ```

    To run in detached mode:

    ```bash
    docker compose up --build -d
    ```

    The application will be available at `http://localhost:3000`. The Redis service will also be started and accessible to the application container at `redis://redis:6379`.

4.  **Stopping Docker Compose:**

    ```bash
    docker compose down
    ```

    To stop and remove volumes (e.g., Redis data):

    ```bash
    docker compose down -v
    ```

## API Documentation

Once the application is running, API documentation (Swagger UI) can be accessed at:

`http://localhost:3000/docs/api`

### API Key Security and Usage

The `GATEWAY_API_KEY` is **optional**. If you choose to set one, it is used to protect your MyInvois Gateway instance from unauthorized access. If it's not set, the gateway will operate without API key authentication, meaning any client that can reach the gateway can use it. **This is not recommended for production environments or publicly accessible instances unless access is strictly controlled by other means (e.g., firewall, VPC).**

If you use a `GATEWAY_API_KEY`, here are some important considerations:

**Security Best Practices (When Using `GATEWAY_API_KEY`):**

- **Strong, Unique Key:** Generate a strong, random, and unique API key. Avoid easily guessable keys.
  - **How to Generate:** You can use various tools to generate a secure key. Here are a couple of examples:
    - **Using OpenSSL (command line):**
      ```bash
      openssl rand -hex 32
      ```
      This command generates a 32-byte (64-character) hexadecimal string.
    - **Using a Password Manager:** Most password managers have a secure password/passphrase generator that can create long, random strings.
    - **Online Generators:** Be cautious with online generators; ensure they are reputable and generate keys client-side if possible.
- **Environment Variables:** Always provide the `GATEWAY_API_KEY` via an environment variable (as shown in the `.env` setup or Docker configurations). Do not hardcode it.
- **Limit Exposure:** Only provide this key to trusted client applications that need to interact with the gateway.

**Why a Simple API Key (If Chosen)?**

When a `GATEWAY_API_KEY` is configured, this gateway is primarily designed to act as a middleware component, often in a server-to-server communication scenario within a trusted network or for backend services. In such controlled environments:

1.  **Simplicity:** A static API key passed in a header (`X-API-KEY`) is a straightforward and widely understood authentication mechanism, reducing complexity for both the gateway and its client applications.
2.  **Controlled Access (with API Key):** If an API key is used, it adds an application-level authorization layer. It's still highly recommended that access to the gateway is restricted at the network level (e.g., firewall rules, private networks, VPCs).
3.  **No User Context:** The gateway itself doesn't manage individual user accounts or sessions. It processes requests based on the provided credentials for the MyInvois service (`CLIENT_ID`, `CLIENT_SECRET`). If a `GATEWAY_API_KEY` is used, it authorizes the _calling application_.
4.  **Focus:** The gateway's main purpose is to simplify interaction with the MyInvois API, not to be a comprehensive identity and access management solution.

## License

This project is licensed under the GNU General Public License v3.0.

A copy of the license is included in the repository in the `LICENSE.md` file.

The canonical source code for MyInvois Gateway is available at:
[myinvois-gateway](https://github.com/farhan-syah/myinvois-gateway)
