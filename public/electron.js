import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    icon: path.join(__dirname, '202.ico'),
    show: false, // Don't show until ready
    titleBarStyle: 'default'
  });

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win.show();
  });

  // Load your React app
  if (isDev) {
    console.log('Running in development mode');
    win.loadURL('http://localhost:5173'); // Vite dev server
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
    console.log('Running in production mode');
    
    // Try multiple possible paths for the index.html file
    const possiblePaths = [
      path.join(__dirname, 'dist/index.html'),
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, '../../dist/index.html'),
      path.join(process.resourcesPath, 'app/dist/index.html'),
      path.join(process.resourcesPath, 'dist/index.html'),
      path.join(process.resourcesPath, 'app.asar/dist/index.html'),
      path.join(__dirname, 'resources/app.asar/dist/index.html')
    ];
    
    console.log('Possible paths:', possiblePaths);
    
    // Try to load the first path that exists
    let indexPath = null;
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        indexPath = possiblePath;
        console.log('Found index.html at:', indexPath);
        break;
      }
    }
    
    if (indexPath) {
      win.loadFile(indexPath);
    } else {
      console.error('Could not find index.html in any of the expected locations');
      // Create a simple error page
      win.loadURL(`data:text/html,<html><body><h1>Error: Could not load app</h1><p>index.html not found</p></body></html>`);
    }
    
    // Add error handling for production
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });
    
    // Add console logging from renderer process
    win.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log('Renderer console:', message);
    });
  }

  // Handle window closed
  win.on('closed', () => {
    // Dereference the window object
    // Note: win is const, so we can't reassign it
    // The garbage collector will handle cleanup
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window instead
    const windows = BrowserWindow.getAllWindows();
    if (windows.length) {
      if (windows[0].isMinimized()) windows[0].restore();
      windows[0].focus();
    }
  });
} 