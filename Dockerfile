FROM ubuntu:22.04

# Install dependencies including ASIO
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    curl \
    libasio-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./

# Build the application
RUN make clean && make

# Expose port
EXPOSE $PORT

# Start the server
CMD ["./server"]