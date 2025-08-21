import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newWord, setNewWord] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8080/search/${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.suggestions || []);
        if (data.suggestions.length === 0) {
          setError(`No suggestions found for "${data.prefix}"`);
        }
      } else {
        setError(data.error || "Search failed");
        setResults([]);
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.");
      setResults([]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    if (!newWord.trim()) {
      setError("Please enter a word to insert");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8080/insert/${encodeURIComponent(newWord.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setNewWord("");
        setError("");
        alert(`Successfully inserted: ${data.word}`);
      } else {
        setError(data.error || "Insert failed");
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.");
      console.error("Insert error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px" }}>
      <h2>Autocomplete Word Lookup</h2>
      
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
        <h3>Add New Word</h3>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleInsert)}
          placeholder="Enter word to add..."
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "200px" }}
          disabled={loading}
        />
        <button onClick={handleInsert} disabled={loading || !newWord.trim()}>
          {loading ? "Adding..." : "Add Word"}
        </button>
      </div>

      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
        <h3>Search Autocomplete</h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleSearch)}
          placeholder="Type to search..."
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "200px" }}
          disabled={loading}
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#ffebee", 
          padding: "0.5rem", 
          borderRadius: "4px", 
          marginBottom: "1rem" 
        }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h4>Suggestions ({results.length}):</h4>
          <ul style={{ marginTop: "1rem" }}>
            {results.map((word, idx) => (
              <li key={idx} style={{ padding: "0.25rem 0" }}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
