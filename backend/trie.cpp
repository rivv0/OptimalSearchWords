#include "trie.h"
#include <iostream>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <list>
using namespace std;

struct TrieNode {
    bool isEnd;
    unordered_map<char, TrieNode*> children;
    TrieNode(): isEnd(false) {}
};
Trie::Trie() {
    root = new TrieNode();
}

void Trie::insert(const string &word) {
    TrieNode* node = root;
    for (char ch : word) {
        if (node->children.find(ch) == node->children.end()) {
            node->children[ch] = new TrieNode();
        }
        node = node->children[ch];
    }
    node->isEnd = true;
}

vector<string> Trie::autocomplete(const string& prefix) {
    TrieNode* node = root;
    for (char c : prefix) {
        if (node->children.count(c) == 0) {
            return {};
        }
        node = node->children[c];
    }
    vector<string> results;
    dfs(node, prefix, results);
    return results;
}

void Trie::dfs(TrieNode* node, string prefix, vector<string> &results) {
    if (node->isEnd) {
        results.push_back(prefix);
    }
    for (auto &p : node->children) {
        dfs(p.second, prefix + p.first, results);
    }
}

void Trie::remove(const string& word) {
    removeHelper(root, word, 0);
}

bool Trie::removeHelper(TrieNode* node, const string& word, size_t index) {
    if (index == word.length()) {
        if (!node->isEnd) return false;
        node->isEnd = false;
        return node->children.empty();
    }
    
    char ch = word[index];
    if (node->children.find(ch) == node->children.end()) {
        return false;
    }
    
    TrieNode* child = node->children[ch];
    bool shouldDeleteChild = removeHelper(child, word, index + 1);
    
    if (shouldDeleteChild) {
        delete child;
        node->children.erase(ch);
        return !node->isEnd && node->children.empty();
    }
    
    return false;
}


LRUCache::LRUCache(int cap) : capacity(cap) {}

bool LRUCache::exists(string prefix) {
    return cacheMap.find(prefix) != cacheMap.end();
}

vector<string> LRUCache::get(string prefix) {
    if (!exists(prefix)) return {};
    auto it = cacheMap[prefix];
    cacheList.splice(cacheList.begin(), cacheList, it);
    return it->second;
}

void LRUCache::put(string prefix, vector<string> res) {
    if (exists(prefix)) {
        auto it = cacheMap[prefix];
        it->second = res;
        cacheList.splice(cacheList.begin(), cacheList, it);
    } else {
        if (static_cast<int>(cacheList.size()) >= capacity) {
            auto last = cacheList.back();
            cacheMap.erase(last.first);
            cacheList.pop_back();
        }
        cacheList.push_front({prefix, res});
        cacheMap[prefix] = cacheList.begin();
    }
}


AutocompleteWords::AutocompleteWords(int cacheCapacity) : cache(cacheCapacity) {}

void AutocompleteWords::insertWord(const string& word) {
    trie.insert(word);
}

vector<string> AutocompleteWords::getSuggestions(const string& prefix, int k) {
    vector<string> res = cache.get(prefix);
    if (res.empty()) {
        res = trie.autocomplete(prefix);
        cache.put(prefix, res);
        cout << "[Cache Miss]";
    } else {
        cout << "[Cache Hit]";
    }
    if ((int)res.size() > k) {
        res.resize(k);
    }
    return res;
}
