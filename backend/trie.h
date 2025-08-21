#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>
#include <unordered_map>
#include <list>


struct TrieNode;

class Trie {
private:
    TrieNode* root;
    void dfs(TrieNode* node, std::string prefix, std::vector<std::string>& results);
    bool removeHelper(TrieNode* node, const std::string& word, size_t index);
public:
    Trie();
    void insert(const std::string& word);
    std::vector<std::string> autocomplete(const std::string& prefix);
    void remove(const std::string& word);
};

class LRUCache {
private:
    int capacity;
    std::list<std::pair<std::string, std::vector<std::string>>> cacheList;
    std::unordered_map<std::string, std::list<std::pair<std::string, std::vector<std::string>>>::iterator> cacheMap;
public:
    LRUCache(int cap);
    bool exists(std::string prefix);
    std::vector<std::string> get(std::string prefix);
    void put(std::string prefix, std::vector<std::string> res);
};

class AutocompleteWords {
private:
    Trie trie;
    LRUCache cache;
public:
    AutocompleteWords(int cacheCapacity);
    void insertWord(const std::string& word);
    std::vector<std::string> getSuggestions(const std::string& prefix, int k);
};

#endif
