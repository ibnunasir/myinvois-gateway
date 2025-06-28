import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import { connectAndInitializeRedis, type redisInstance } from "./redis"; // Import new function and instance
import { controllers } from "./routes";
import { errorHandler } from "./utils/error-handler";
import { CONFIG } from "./config";
import cors from "@elysiajs/cors";

async function startServer() {
  // Check for essential non-Redis environment variables first
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.error(
      "CLIENT_ID and CLIENT_SECRET must be defined in the environment variables"
    );
    process.exit(1);
  }
  const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

  let connectedRedisInstance: typeof redisInstance | null = null;
  if (process.env.REDIS_URL) {
    console.log("REDIS_URL is set, attempting to connect to Redis...");
    try {
      connectedRedisInstance = await connectAndInitializeRedis();
      if (!connectedRedisInstance || !connectedRedisInstance.isOpen) {
        // This case should ideally be covered by connectAndInitializeRedis throwing
        console.error(
          "CRITICAL: Redis connection attempt did not result in an open connection. Exiting."
        );
        process.exit(1);
      }
      console.log(
        "✅ Redis connected successfully and will be used for caching."
      );
    } catch (redisError) {
      console.error(
        "CRITICAL: Application startup failed due to Redis connection error. Exiting.",
        redisError
      );
      process.exit(1); // Exit if Redis connection failed
    }
  } else {
    console.log("ℹ️ REDIS_URL not set. Running without Redis caching.");
    // redisInstance from ./redis will be null, and MyInvoisClient will handle it.
  }

  const swaggerDescription = `Handles the submission of new MyInvois documents via the gateway.
This endpoint significantly simplifies the document submission process compared to interacting directly with the official MyInvois API.
Instead of requiring complex, Base64-encoded UBL (XML or JSON), you can submit document data using a **developer-friendly, standard JSON structure**.
The gateway, powered by the [myinvois-client](https://github.com/farhan-syah/myinvois-client) library, takes care of:
1.  Translating your simple JSON input into the required UBL format.
2.  Calculating document hashes.
3.  Base64 encoding the UBL.
4.  Formatting the request payload for the official API.
5.  Handle the document signing.
6.  Supporting caching through Redis (if configured).

Use this gateway to easily submit invoices, credit notes, or debit notes from any application capable of making standard HTTP POST requests with a JSON body.
`;

  const app = new Elysia()
    .use(() => errorHandler)
    .use(
      staticPlugin({
        assets: "public", // Serve from the 'public' directory
        prefix: "", // Serve at the root (e.g., /index.html)
        indexHTML: true, // Serve public/index.html for '/' requests
      })
    )
    .use(
      swagger({
        path: "/docs/api",
        documentation: {
          info: {
            title: "MyInvois Gateway API Documentation",
            description: swaggerDescription,
            version: process.env.npm_package_version ?? "-",
          },
          tags: [
            { name: "Documents", description: "Documents endpoints" },
            { name: "Submissions", description: "Submissions endpoints" },
            { name: "Taxpayers", description: "Taxpayers endpoints" },
          ],
          components: {
            ...(GATEWAY_API_KEY
              ? {
                  securitySchemes: {
                    apiKeyAuth: {
                      type: "apiKey",
                      name: "X-API-KEY",
                      in: "header",
                    },
                  },
                }
              : {}),
          },
        },
        swaggerOptions: {
          defaultModelRendering: "model",
        },
      })
    );

  if (GATEWAY_API_KEY) {
    app.onBeforeHandle(({ request, set }) => {
      const requestPath = new URL(request.url).pathname;
      // Requests for static assets (like /index.html served for / by indexHTML: true)
      // are typically handled by the static plugin before this hook.
      // We still exclude API docs explicitly.
      const excludedPaths = new Set([
        "/", // Exclude the main page (index.html)
        "/docs/api", // Exclude the Swagger UI base path
        "/docs/api/", // Exclude Swagger UI base path with trailing slash
        "/docs/api/json", // Exclude the path for the Swagger JSON spec
      ]);

      // If the path is for root (index.html) or other excluded paths, skip API key check.
      if (excludedPaths.has(requestPath)) {
        return;
      }

      const apiKey = request.headers.get("X-API-KEY");
      if (apiKey !== GATEWAY_API_KEY) {
        set.status = 401;
        return {
          error:
            "Unauthorized: Invalid or missing API Key in X-API-Key header.",
        };
      }
    });
  }

  // The @elysiajs/static plugin with indexHTML: true will handle serving index.html for "/"

  controllers.forEach((controller: any) => {
    app.use(controller);
  });

  app.use(cors());
  app.listen(CONFIG.port);

  console.log(`MyInvois Gateway is running at ${app.server?.url}`);
  // The check for redisInstance (which is the potentially connected client)
  // is done above. If it's connected, MyInvoisClient will use it.
}

startServer().catch((error) => {
  // Catch any other unhandled errors during server startup
  console.error("Unhandled error during server startup:", error);
  process.exit(1);
});
