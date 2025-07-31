import React from 'react';
import { useElectron } from '@/hooks/useElectron';

const ElectronTitleBar: React.FC = () => {
  const { isElectron, platform } = useElectron();

  if (!isElectron || platform === 'darwin') {
    return null; // macOS handles title bar differently
  }

  return (
    <div 
      style={{
        height: '32px',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        WebkitAppRegion: 'drag',
        userSelect: 'none'
      }}
    >
      AI Companion
    </div>
  );
};

export default ElectronTitleBar;