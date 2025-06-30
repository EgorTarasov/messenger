# Build stage
FROM golang:1.24.4-bookworm AS builder

WORKDIR /app/

# Installing Node.js and pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

# Installing taskfile support https://taskfile.dev/installation/
RUN sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

COPY . .

RUN test -f /app/Taskfile.yaml && echo "Taskfile founded" || (echo "failed to find Taskfile")

RUN task build

# Check if the build artifact exists
RUN test -f /app/bin/server && echo "Build succeeded" || (echo "Build failed" && exit 1)

# Final stage - minimal image
FROM debian:bookworm-slim

# Install ca-certificates for HTTPS requests
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -r -s /bin/false appuser

# Copy the binary from builder stage
COPY --from=builder /app/bin/server /bin/server

# Create data directory
RUN mkdir -p /data/pb_data && chown appuser:appuser /data/pb_data

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8090

CMD ["/bin/server", "serve", "--dir", "/data/pb_data", "--http", "0.0.0.0:8090"]