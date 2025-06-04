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
- `REDIS_URL` (Optional): The connection URL for Redis (e.g., `redis://localhost:6379` for local development, or `redis://redis:6379` when using Docker Compose). If not provided, the application will run without Redis caching.

**Setup:**

Create a `.env` file in the root of the project (`myinvois-gateway/.env`) and add your credentials:

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
# REDIS_URL=redis://localhost:6379 # Optional: for local Bun development if using local Redis
```

This `.env` file will be automatically used by `bun run dev`, when running the compiled binary locally (if your application loads it, typically via a library like `dotenv` which Bun might handle implicitly for `process.env`), and by Docker Compose if it's in the same directory.

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

This method involves building a Docker image from the `Dockerfile` and then running it as a container.

1.  **Build the Docker image:**
    From the project root (`myinvois-gateway/`), run:

    ```bash
    docker build -t myinvois-gateway .
    ```

    (If using `docker buildx` and you want to load it directly into your local images: `docker buildx build -t myinvois-gateway --load .`)

2.  **Run the Docker container:**
    ```bash
    docker run -d \
      -e CLIENT_ID="your_client_id_here" \
      -e CLIENT_SECRET="your_client_secret_here" \
      -e REDIS_URL="redis://host.docker.internal:6379" \
      -p 3000:3000 \
      --name myinvois_gateway_app \
      myinvois-gateway
    ```
    - Replace placeholder values for `CLIENT_ID` and `CLIENT_SECRET`.
    - `REDIS_URL="redis://host.docker.internal:6379"` assumes you have Redis running on your host machine and accessible. If you don't need Redis, you can omit this line.
    - The `-d` flag runs the container in detached mode.
    - Access the application at `http://localhost:3000`.
    - To see logs: `docker logs myinvois_gateway_app`
    - To stop: `docker stop myinvois_gateway_app`
    - To remove: `docker rm myinvois_gateway_app`

### 4. Using Docker Compose

This is the recommended method for a consistent development and testing environment, as it manages both the application and Redis services.

1.  **Ensure Docker Compose is installed.**
2.  **Create/Verify `.env` file:** Make sure you have a `.env` file in the project root (`myinvois-gateway/.env`) with your `CLIENT_ID` and `CLIENT_SECRET`. The `REDIS_URL` will be handled by Docker Compose to point to its own Redis service.
    ```env
    CLIENT_ID=your_client_id_here
    CLIENT_SECRET=your_client_secret_here
    ```
3.  **Run Docker Compose:**
    Navigate to the project root (`myinvois-gateway/`) where `docker-compose.yml` is located.

    - To build images (if necessary) and start services:
      ```bash
      docker-compose up --build
      ```
    - To run in detached mode:
      `bash
    docker-compose up --build -d
    `
      The application will be available at `http://localhost:3000`. The Redis service will also be started and accessible to the application container at `redis://redis:6379`.

4.  **Stopping Docker Compose:**
    ```bash
    docker-compose down
    ```
    To stop and remove volumes (e.g., Redis data):
    ```bash
    docker-compose down -v
    ```

## API Documentation

Once the application is running, API documentation (Swagger UI) can be accessed at:

`http://localhost:3000/docs/api`

## Linting

To lint the codebase:

```bash
bun run lint
```

To automatically fix linting issues:

```bash
bun run lint:fix
```
