import React, { useEffect } from 'react';

// Single AudioContext for the component's lifecycle
let audioContext: AudioContext | null = null;

const notes: { [key: string]: { freq: number } } = {
  'C4': { freq: 261.63 }, 'C#4': { freq: 277.18 }, 'D4': { freq: 293.66 }, 'D#4': { freq: 311.13 },
  'E4': { freq: 329.63 }, 'F4': { freq: 349.23 }, 'F#4': { freq: 369.99 }, 'G4': { freq: 392.00 },
  'G#4': { freq: 415.30 }, 'A4': { freq: 440.00 }, 'A#4': { freq: 466.16 }, 'B4': { freq: 493.88 },
  'C5': { freq: 523.25 }, 'C#5': { freq: 554.37 }, 'D5': { freq: 587.33 }, 'D#5': { freq: 622.25 },
  'E5': { freq: 659.25 }, 'F5': { freq: 698.46 }, 'F#5': { freq: 739.99 }, 'G5': { freq: 783.99 },
  'G#5': { freq: 830.61 }, 'A5': { freq: 880.00 }, 'A#5': { freq: 932.33 }, 'B5': { freq: 987.77 },
};

const PianoKey = ({ noteName, isBlack }: { noteName: string, isBlack: boolean }) => {
    
  const playNote = () => {
    if (!audioContext) return;
    const note = notes[noteName];
    if (!note) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
    
    // Simple attack/decay envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  };
  
  const keyStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    border: '1px solid #333',
    borderRadius: '0 0 5px 5px',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '10px',
    fontWeight: 'bold',
    transition: 'background-color 0.1s ease',
  };

  const whiteKeyStyle: React.CSSProperties = {
    ...keyStyle,
    width: '60px',
    height: '220px',
    backgroundColor: '#fff',
    color: '#333',
    margin: '0 1px',
  };

  const blackKeyStyle: React.CSSProperties = {
    ...keyStyle,
    width: '36px',
    height: '140px',
    backgroundColor: '#333',
    color: 'white',
    position: 'absolute',
    zIndex: 2,
  };
  
  const style = isBlack ? blackKeyStyle : whiteKeyStyle;

  return (
    <div style={style} onMouseDown={playNote}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isBlack ? '#555' : '#eee')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isBlack ? '#333' : '#fff')}>
      {noteName.replace(/#\d/,'#').replace(/\d/,'')}
    </div>
  );
};

const PianoGame = () => {
    
  useEffect(() => {
    // Initialize AudioContext on component mount after a user interaction
    const initAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);

    return () => {
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(e => console.error(e));
            audioContext = null;
        }
        document.removeEventListener('click', initAudio);
    }
  }, []);

  const pianoContainerStyle: React.CSSProperties = {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    height: '240px',
    width: '882px', 
    margin: 'auto',
    padding: '10px',
    backgroundColor: '#222',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  };
  
  const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
  const blackKeys: { note: string; position: number }[] = [
      { note: 'C#4', position: 1 }, { note: 'D#4', position: 2 },
      { note: 'F#4', position: 4 }, { note: 'G#4', position: 5 }, { note: 'A#4', position: 6 },
      { note: 'C#5', position: 8 }, { note: 'D#5', position: 9 },
      { note: 'F#5', position: 11 }, { note: 'G#5', position: 12 }, { note: 'A#5', position: 13 },
  ];

  return (
    <div>
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Piano</h2>
        <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, color: '#e0e6ff' }}>Click the keys to play a note!</p>
        <div style={pianoContainerStyle}>
          {whiteKeys.map((noteName) => (
            <PianoKey key={noteName} noteName={noteName} isBlack={false} />
          ))}
          {blackKeys.map(({ note, position }) => (
              <div key={note} style={{ position: 'absolute', top: 10, left: 10 + position * 62 - (36/2) }}>
                  <PianoKey noteName={note} isBlack={true} />
              </div>
          ))}
        </div>
    </div>
  );
};

export default PianoGame; 