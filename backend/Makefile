CXX = g++

# Detect if we're on macOS (Darwin) or Linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
    # macOS with Homebrew
    CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -I/opt/homebrew/include
else
    # Linux (including Docker)
    CXXFLAGS = -std=c++17 -Wall -Wextra -O2
endif

all: server

server: server.cpp trie.cpp trie.h
	$(CXX) $(CXXFLAGS) server.cpp trie.cpp -o server -pthread

clean:
	rm -f server

.PHONY: all clean
