# Stage 1: Build the application
FROM oven/bun:1 AS builder
ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

WORKDIR /app

# Copy package.json and tsconfig.json.
# If bun.lockb were present, we'd copy it too.
COPY package.json tsconfig.json ./

# Install dependencies
# Bun will generate a bun.lockb if it doesn't exist
RUN bun install

# Copy the rest of the application source code
COPY src ./src
# If you have other assets or config files needed for the build, copy them too.
# For example:
# COPY public ./public

# Run the build script to compile the application
# This will create an executable named 'server' in the current WORKDIR (/app)
RUN bun run build

# Stage 2: Create the final production image
FROM oven/bun:1-slim

WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser /app

# Copy the compiled executable from the builder stage
COPY --from=builder /app/server .

# Copy the static assets from the builder stage
# The source /app/src/static is where they are in the builder.
# The destination ./src/static creates /app/src/static in the final image.
COPY --from=builder /app/src/static ./src/static

# Switch to non-root user
USER appuser

# Expose the port the application listens on
EXPOSE 3000

# Environment variables like CLIENT_ID, CLIENT_SECRET, REDIS_URL
# will need to be provided at runtime (e.g., docker run -e VAR=value)

# Command to run the application
CMD ["./server"]
