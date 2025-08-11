import { useState, useEffect } from 'react';

interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  openExternal: (url: string) => Promise<void>;
  isElectron: boolean;
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [version, setVersion] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    const checkElectron = async () => {
      if (window.electronAPI) {
        setIsElectron(true);
        try {
          const appVersion = await window.electronAPI.getVersion();
          const appPlatform = await window.electronAPI.getPlatform();
          setVersion(appVersion);
          setPlatform(appPlatform);
        } catch (error) {
          console.error('Error getting electron info:', error);
        }
      }
    };

    checkElectron();
  }, []);

  return {
    isElectron,
    version,
    platform,
    openExternal: window.electronAPI?.openExternal
  };
};