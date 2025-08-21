CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -I/opt/homebrew/include

all: server

server: server.cpp trie.cpp trie.h
	$(CXX) $(CXXFLAGS) server.cpp trie.cpp -o server -pthread

clean:
	rm -f server

.PHONY: all clean
