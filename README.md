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

## Getting Started

### 1. Clone the Repository (if you haven't already)

```bash
git clone <your-repository-url>
cd myinvois-gateway
```

### 2. Install Dependencies

The project uses Bun. If you have a `package.json` or `bun.lockb`, dependencies would typically be installed with:

```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add the necessary environment variables:

```env
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"

# Optional: For Redis caching
# REDIS_URL="redis://username:password@host:port"
```

### 4. Development

To start the development server run:

```bash
bun run dev
```

The server will start, and you should see a message like:
`🦊 Elysia is running at http://localhost:3000` (or similar, based on your `app.server?.url`)

Open http://localhost:3000/docs/api with your browser to see the API documentation.

## API Documentation

Interactive API documentation is available through Swagger UI once the server is running.
Access it at: `http://localhost:3000/docs/api`

The documentation provides details on:

- Available endpoints (Documents, Submissions, Taxpayers).
- Request and response schemas.
- How to interact with the API.

## Technology Stack

- **Framework:** ElysiaJS
- **Language:** TypeScript
- **Runtime:** Bun
- **Caching (Optional):** Redis
- **API Documentation:** Swagger (via `@elysiajs/swagger`)

## Environment Variables

The application requires the following environment variables:

- `CLIENT_ID`: **Required**. Your client identifier for the MyInvois API.
- `CLIENT_SECRET`: **Required**. Your client secret for the MyInvois API.
- `REDIS_URL`: **Optional**. The connection URL for your Redis instance. If not provided, the application will run without Redis caching.
  - Example: `redis://localhost:6379`
  - Example with auth: `redis://:yourpassword@yourhost:6379`

## Project Structure (Key Files & Directories)

- `src/index.ts`: Main application entry point, sets up Elysia, Swagger, Redis connection, and starts the server.
- `src/routes/`: Contains the route controllers for different API resources.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
