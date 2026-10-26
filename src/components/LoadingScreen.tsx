import { useEffect, useState } from 'react';

interface Props {
  heroName: string;
  stageNumber?: string;
  stageName?: string;
  worldName?: string;
  objective?: string;
  onLoadingComplete: () => void;
}

export default function LoadingScreen({
  heroName,
  stageNumber = '1-1',
  stageName = 'TUTORIAL MEADOW',
  worldName = 'WORLD 1 - EMBERLEAF MEADOW',
  objective = 'Collect 10 coins',
  onLoadingComplete,
}: Props) {
  const [dots, setDots] = useState<string>('..');

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 400);

    // Auto complete loading after 2.2 seconds
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#07080c',
        zIndex: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Silkscreen', 'Press Start 2P', monospace",
        userSelect: 'none',
      }}
    >
      {/* Center Dark Navy Stage Card matching reference image */}
      <div
        style={{
          width: '420px',
          maxWidth: '90%',
          backgroundColor: '#111726',
          border: '3px solid #000',
          borderRight: '4px solid #d84800',
          borderBottom: '4px solid #d84800',
          boxShadow: '0 0 20px rgba(0,0,0,0.8)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        {/* World Name (Yellow font) */}
        <div style={{ color: '#ffd000', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {worldName}
        </div>

        {/* Stage Title (White bold font) */}
        <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {stageNumber} • {stageName}
        </div>

        {/* Objective Subtext (Grey font) */}
        <div style={{ color: '#aaa', fontSize: '9px', marginTop: '2px' }}>
          {objective}
        </div>

        {/* Hero Ready Loading Text (Yellow font) */}
        <div style={{ color: '#ffd000', fontSize: '10px', fontWeight: 'bold', marginTop: '10px', letterSpacing: '1px' }}>
          {heroName.toUpperCase()} READY • LOADING{dots}
        </div>
      </div>
    </div>
  );
}
