FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    g++ \
    make \
    cmake \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN make clean && make

EXPOSE 8080

CMD ["./server"]