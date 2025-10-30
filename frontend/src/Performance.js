import React, { useState, useEffect } from 'react';

const Performance = ({ searchTime, resultCount }) => {
  const [fps, setFps] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - startTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - startTime)));
        frameCount = 0;
        startTime = currentTime;
      }
      
      requestAnimationFrame(updateFPS);
    };

    updateFPS();
  }, []);

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(30, 30, 35, 0.9)',
      border: '1px solid #333',
      padding: '10px 15px',
      fontSize: '0.7rem',
      color: '#aaa',
      fontFamily: 'JetBrains Mono, monospace',
      zIndex: 1000,
      minWidth: '120px'
    },
    metric: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    value: {
      color: '#e0e0e0',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.metric}>
        <span>FPS:</span>
        <span style={styles.value}>{fps}</span>
      </div>
      <div style={styles.metric}>
        <span>SEARCH:</span>
        <span style={styles.value}>{searchTime || 0}ms</span>
      </div>
      <div style={styles.metric}>
        <span>RESULTS:</span>
        <span style={styles.value}>{resultCount || 0}</span>
      </div>
    </div>
  );
};

export default Performance;