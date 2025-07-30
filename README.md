# Companion App - Electron Desktop Application

This is a React + Vite + Electron desktop application that provides a companion interface.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

### Running in Development Mode

To run the app in development mode with hot reload:

```bash
npm run dev:electron
```

This will:
- Start the Vite development server
- Wait for the server to be ready
- Launch Electron pointing to the dev server

### Alternative Development Commands

```bash
# Start Vite dev server only
npm run dev

# Start Electron only (requires Vite server to be running)
npm run electron

# Run both Vite and Electron with wait-on
npm run electron-dev
```

## Building for Production

### Step 1: Build the React App

```bash
npm run build
```

This creates a `dist` folder with your production-ready React app.

### Step 2: Build the Electron Executable

#### For Windows (.exe):
```bash
npm run dist-win
```

#### For macOS (.dmg):
```bash
npm run dist-mac
```

#### For Linux (.AppImage):
```bash
npm run dist-linux
```

#### For all platforms:
```bash
npm run dist
```

### Alternative Build Commands

```bash
# Windows only
npm run electron-pack

# macOS only
npm run electron-pack-mac

# Linux only
npm run electron-pack-linux
```

## Output

After building, you'll find the executables in the `dist-electron` folder:
- Windows: `.exe` installer
- macOS: `.dmg` file
- Linux: `.AppImage` file

## Project Structure

```
├── public/
│   ├── electron.js          # Electron main process
│   ├── 202.ico             # App icon
│   └── ...                 # Other static assets
├── src/                    # React source code
├── dist/                   # Built React app (after build)
├── dist-electron/          # Built Electron app (after packaging)
└── package.json           # Project configuration
```

## Configuration

The Electron app is configured in:
- `public/electron.js` - Main process file
- `package.json` - Build configuration and scripts

## Troubleshooting

1. **App won't start**: Make sure all dependencies are installed with `npm install`
2. **Build fails**: Ensure you have the correct Node.js version and all dependencies
3. **Electron can't find files**: Check that the build path in `electron.js` matches your Vite output directory

## Development Tips

- Use `npm run dev:electron` for development with hot reload
- The app will automatically reload when you make changes to the React code
- Electron DevTools are available in development mode
- Check the console for any error messages

## Production Notes

- The built app will be larger than the source code due to included dependencies
- The app includes all necessary files to run independently
- Windows builds create an installer that can be distributed to users
