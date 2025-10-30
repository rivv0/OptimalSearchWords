# Smart Word Lookup - Autocomplete System

A high-performance autocomplete system built with React frontend and C++ backend using Trie data structure.

## Features

- **Fast Autocomplete**: Trie-based search with O(k) complexity where k is the prefix length
- **Real-time Search**: Live suggestions as you type
- **Word Database**: Pre-loaded with 900+ common English words
- **LRU Caching**: Efficient caching for frequently searched prefixes
- **Modern UI**: Beautiful, responsive React interface
- **CORS Enabled**: Full cross-origin support

## Architecture

### Backend (C++)
- **Trie Data Structure**: Efficient prefix-based search
- **Crow Web Framework**: Fast HTTP server
- **LRU Cache**: Memory-efficient caching system
- **Word Loading**: Supports both file-based and hardcoded word lists

### Frontend (React)
- **Real-time Search**: Debounced search with 300ms delay
- **Modern UI**: Gradient design with hover effects
- **Error Handling**: Comprehensive error states
- **Responsive Design**: Works on all screen sizes

## API Endpoints

### Search Words
```
GET /search/{prefix}
```
Returns autocomplete suggestions for the given prefix.

**Response:**
```json
{
  "prefix": "hel",
  "suggestions": ["help", "hello", "heart"],
  "count": 3
}
```

### Add Word
```
GET /insert/{word}
```
Adds a new word to the trie.

**Response:**
```json
{
  "success": true,
  "message": "Word inserted",
  "word": "example"
}
```

### Remove Word
```
GET /remove/{word}
```
Removes a word from the trie.

### Get Definition (Future)
```
GET /define/{word}
```
Returns word definition (placeholder for dictionary API integration).

## Running the Application

### Backend
```bash
cd backend
make
./server
```
Server runs on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## Word Database

The system loads words from `backend/words.txt`. You can:
1. Add new words to the file (one per line)
2. Restart the server to reload words
3. Use the web interface to add words dynamically

## Performance

- **Search Time**: O(k) where k is prefix length
- **Memory Usage**: Optimized trie structure
- **Caching**: LRU cache for frequent searches
- **Concurrent**: Multi-threaded server support

## Future Enhancements

- [ ] Dictionary API integration for definitions
- [ ] Word frequency scoring
- [ ] Fuzzy search support
- [ ] Database persistence
- [ ] User authentication
- [ ] Custom word lists per user

## Technology Stack

- **Backend**: C++17, Crow Framework, ASIO
- **Frontend**: React, Modern CSS
- **Data Structure**: Trie with LRU Cache
- **Build System**: Make, npm

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.