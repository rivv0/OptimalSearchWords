
# Optimal Search Words

A small project that explores **efficient word search** using a **Trie data structure** with **LRU-based caching**.
The idea is simple: store a dictionary of words, and when a user searches, they get the most frequent or recently used matches quickly.

It also has a **C++ backend (Crow)** serving APIs and a **React frontend** to try things out.

---

##  Features

*  Trie-based insertion and search
*  LRU cache to speed up frequent lookups
*  REST API (C++ / Crow) to interact with the data
*  React frontend to visualize and test search

----

## Project Structure

```
OptimalSearchWords/
├── backend/            # C++ server using Crow
│   ├── trie.cpp        # Trie + LRU cache logic
│   ├── server.cpp      # Crow server exposing APIs
│   └── ...
├── frontend/           # React app
│   ├── src/
│   └── ...
└── README.md
```

## API Endpoints

* `GET /search?word=abc` → returns matches (with LRU/frequency handling)
* `POST /insert` → add a new word to the Trie
* `GET /all_words` → list all words in the dictionary

---

##  Scalability and future enhancements

* External dictionary loader (fetch from API)
* Store search stats in SQLite/Postgres
* Add ranking tweaks (popularity + recency)
* UI improvements (search suggestions dropdown)



