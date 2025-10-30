import React, { useState, useEffect, useRef } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newWord, setNewWord] = useState("");
  const [success, setSuccess] = useState("");
  const [realtimeResults, setRealtimeResults] = useState([]);
  const canvasRef = useRef();
  const animationRef = useRef();

  // Force the correct backend URL for debugging
  const API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://searchoptimally.onrender.com'
    : 'http://localhost:8080';

  // Debug logging
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API_BASE:', API_BASE);
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing backend connection to:', API_BASE);
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('Backend connection test successful:', data);
      } catch (err) {
        console.error('Backend connection test failed:', err);
        console.error('Make sure backend URL is correct:', API_BASE);
      }
    };
    testConnection();
  }, [API_BASE]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const mouseTrail = [];
    const floatingTexts = [];
    let time = 0;

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 4 + 2,
        alpha: Math.random() * 0.8 + 0.3,
        originalAlpha: Math.random() * 0.8 + 0.3,
        color: {
          r: Math.random() * 50 + 100,
          g: Math.random() * 50 + 100,
          b: Math.random() * 50 + 130
        }
      });
    }

    // Initialize floating texts
    const words = ['SEARCH', 'TRIE', 'FAST', 'DATA', 'STRUCT', 'ALGO', 'SPEED', 'CACHE'];
    for (let i = 0; i < 8; i++) {
      floatingTexts.push({
        text: words[i],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1,
        originalAlpha: Math.random() * 0.3 + 0.1,
        size: Math.random() * 8 + 12
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      mouseTrail.push({
        x: mouseX,
        y: mouseY,
        life: 30,
        maxLife: 30
      });

      if (mouseTrail.length > 25) {
        mouseTrail.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(18, 18, 22, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Draw grid
      ctx.strokeStyle = 'rgba(60, 60, 70, 0.6)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw diagonal lines for extra effect
      ctx.strokeStyle = 'rgba(80, 80, 90, 0.2)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width + canvas.height; i += 120) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(0, i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width - i, 0);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const pulse = Math.sin(time + i * 0.3) * 0.4;
        particle.alpha = particle.originalAlpha + pulse;

        // Draw glow effect
        ctx.shadowColor = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw connecting lines between nearby particles
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const opacity = (100 - distance) / 100 * 0.3;
              ctx.strokeStyle = `rgba(120, 120, 140, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x + particle.size / 2, particle.y + particle.size / 2);
              ctx.lineTo(otherParticle.x + otherParticle.size / 2, otherParticle.y + otherParticle.size / 2);
              ctx.stroke();
            }
          }
        });
      });

      // Draw mouse trail with enhanced effects
      mouseTrail.forEach((trail, i) => {
        const alpha = (trail.life / trail.maxLife);
        const size = alpha * 6;

        // Draw glow effect for trail
        ctx.shadowColor = `rgba(200, 200, 220, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(200, 200, 220, ${alpha * 0.8})`;
        ctx.fillRect(trail.x - size / 2, trail.y - size / 2, size, size);

        // Draw inner bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.fillRect(trail.x - 1, trail.y - 1, 2, 2);

        trail.life--;
      });

      // Draw floating texts
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'center';
      floatingTexts.forEach((text, i) => {
        text.x += text.vx;
        text.y += text.vy;

        if (text.x < 0 || text.x > canvas.width) text.vx *= -1;
        if (text.y < 0 || text.y > canvas.height) text.vy *= -1;

        const pulse = Math.sin(time + i * 0.5) * 0.2;
        text.alpha = text.originalAlpha + pulse;

        ctx.fillStyle = `rgba(140, 140, 150, ${text.alpha})`;
        ctx.fillText(text.text, text.x, text.y);
      });

      // Remove dead trails
      for (let i = mouseTrail.length - 1; i >= 0; i--) {
        if (mouseTrail[i].life <= 0) {
          mouseTrail.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        handleRealtimeSearch();
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setRealtimeResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleRealtimeSearch = async () => {
    if (!query.trim()) return;

    try {
      const url = `${API_BASE}/search/${encodeURIComponent(query.trim())}`;
      console.log('Making realtime search request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Realtime search response status:', response.status);

      const data = await response.json();
      console.log('Realtime search response data:', data);

      if (response.ok) {
        setRealtimeResults(data.suggestions || []);
      }
    } catch (err) {
      console.error("Realtime search error:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        url: `${API_BASE}/search/${encodeURIComponent(query.trim())}`
      });
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Enter search term");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.suggestions || []);
        if (data.suggestions.length === 0) {
          setError(`No results for "${data.prefix}"`);
        }
      } else {
        setError(data.error || "Search failed");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`Connection failed: ${err.message}. Backend URL: ${API_BASE}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    if (!newWord.trim()) {
      setError("Enter word to add");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/insert/${encodeURIComponent(newWord.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setNewWord("");
        setSuccess(`Added: ${data.word}`);
      } else {
        setError(data.error || "Insert failed");
      }
    } catch (err) {
      console.error("Insert error:", err);
      setError(`Connection failed: ${err.message}. Backend URL: ${API_BASE}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const selectSuggestion = (word) => {
    setQuery(word);
    setRealtimeResults([]);
  };

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection to:', API_BASE);
      
      // Simple fetch without extra headers
      const response = await fetch(`${API_BASE}/health`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setSuccess(`✅ Backend connection successful! Status: ${data.status}`);
      setError("");
      
    } catch (err) {
      console.error('Backend connection test failed:', err);
      setError(`❌ Connection failed: ${err.message} (URL: ${API_BASE})`);
      setSuccess("");
    }
  };

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      color: '#e0e0e0',
      overflow: 'hidden'
    },
    content: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.8s ease-out'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '300',
      color: '#f0f0f0',
      margin: '0 0 10px 0',
      letterSpacing: '2px'
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#888',
      margin: 0,
      letterSpacing: '1px'
    },
    mainPanel: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'rgba(25, 25, 30, 0.98)',
      border: '2px solid #444',
      padding: '30px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    section: {
      marginBottom: '25px',
      padding: '20px',
      backgroundColor: 'rgba(35, 35, 40, 0.9)',
      border: '2px solid #555',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    },
    sectionTitle: {
      fontSize: '0.8rem',
      color: '#aaa',
      margin: '0 0 15px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start'
    },
    inputContainer: {
      flex: 1,
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      backgroundColor: '#1a1a1e',
      border: '2px solid #666',
      color: '#e0e0e0',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'all 0.2s',
      fontFamily: 'inherit',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#666'
    },
    button: {
      padding: '12px 20px',
      backgroundColor: '#333',
      border: '2px solid #666',
      color: '#e0e0e0',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontFamily: 'inherit',
      minWidth: '80px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    },
    buttonHover: {
      backgroundColor: '#444',
      borderColor: '#666'
    },
    buttonDisabled: {
      backgroundColor: '#222',
      borderColor: '#333',
      color: '#666',
      cursor: 'not-allowed'
    },
    suggestions: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#1a1a1e',
      border: '1px solid #555',
      borderTop: 'none',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000
    },
    suggestion: {
      padding: '10px 15px',
      cursor: 'pointer',
      borderBottom: '1px solid #333',
      fontSize: '0.9rem',
      transition: 'background-color 0.1s'
    },
    suggestionHover: {
      backgroundColor: '#2a2a2e'
    },
    message: {
      padding: '10px 15px',
      fontSize: '0.8rem',
      border: '1px solid',
      marginBottom: '15px'
    },
    error: {
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      borderColor: '#dc3545',
      color: '#ff6b7a'
    },
    success: {
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderColor: '#28a745',
      color: '#6bcf7f'
    },
    results: {
      marginTop: '20px'
    },
    resultsTitle: {
      fontSize: '0.8rem',
      color: '#aaa',
      margin: '0 0 15px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    resultGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '8px'
    },
    resultItem: {
      padding: '8px 12px',
      backgroundColor: '#2a2a2e',
      border: '1px solid #444',
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'all 0.1s'
    },
    resultItemHover: {
      backgroundColor: '#333',
      borderColor: '#555'
    },
    footer: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '0.7rem',
      color: '#666',
      letterSpacing: '1px'
    }
  };

  return (
    <div style={styles.container}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>WORD LOOKUP</h1>
          <p style={styles.subtitle}>TRIE-BASED AUTOCOMPLETE SYSTEM</p>
        </div>

        <div style={styles.mainPanel}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add Word</h3>
            <div style={styles.inputGroup}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleInsert)}
                  placeholder="Enter word..."
                  style={styles.input}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleInsert}
                disabled={loading || !newWord.trim()}
                style={{
                  ...styles.button,
                  ...(loading || !newWord.trim() ? styles.buttonDisabled : {})
                }}
              >
                {loading ? "..." : "ADD"}
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Search</h3>
            <div style={styles.inputGroup}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                  placeholder="Type to search..."
                  style={styles.input}
                  disabled={loading}
                />
                {realtimeResults.length > 0 && (
                  <div style={styles.suggestions}>
                    {realtimeResults.slice(0, 5).map((word, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(word)}
                        style={styles.suggestion}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.suggestionHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                style={{
                  ...styles.button,
                  ...(loading || !query.trim() ? styles.buttonDisabled : {})
                }}
              >
                {loading ? "..." : "SEARCH"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ ...styles.message, ...styles.error }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ ...styles.message, ...styles.success }}>
              {success}
            </div>
          )}

          {results.length > 0 && (
            <div style={styles.results}>
              <h4 style={styles.resultsTitle}>Results ({results.length})</h4>
              <div style={styles.resultGrid}>
                {results.map((word, idx) => (
                  <div
                    key={idx}
                    style={styles.resultItem}
                    onClick={() => selectSuggestion(word)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = styles.resultItemHover.backgroundColor;
                      e.target.style.borderColor = styles.resultItemHover.borderColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#2a2a2e';
                      e.target.style.borderColor = '#444';
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button
            onClick={testBackendConnection}
            style={{
              ...styles.button,
              fontSize: '0.7rem',
              padding: '8px 12px',
              marginBottom: '10px'
            }}
          >
            TEST BACKEND CONNECTION
          </button>
          <br />
          C++ TRIE × REACT × CANVAS ANIMATIONS
        </div>
      </div>
    </div>
  );
}

export default App;