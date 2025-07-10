# Companion Three Paths

## Project Overview

This project is a modern React application built with Vite, TypeScript, Tailwind CSS, and shadcn-ui. It provides an interactive AI companion experience, including physical exercises, creative activities, and a companion interface. The app is packaged as a Windows desktop application using Electron, allowing users to install and run it as a standalone .exe file.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Media and Photos Used](#media-and-photos-used)
- [Development Process](#development-process)
- [Packaging as a Desktop App](#packaging-as-a-desktop-app)
- [How to Build and Run](#how-to-build-and-run)
- [Troubleshooting](#troubleshooting)

---

## Features
- **AI Companion Interface**: Chat and interact with an AI companion.
- **Physical Exercise Modules**: Animated exercise cards with countdowns and voice guidance.
- **Creative Activities**: Includes games and music player.
- **Yoga and Core Strength Tabs**: Guided routines with GIFs and instructions.
- **Media-rich UI**: Uses GIFs, images, and videos for an engaging experience.
- **Packaged as a Windows .exe**: Can be installed and run on any Windows 10/11 machine.

---

## Technologies Used
- **React** (with TypeScript)
- **Vite** (for fast development and builds)
- **Tailwind CSS** (utility-first styling)
- **shadcn-ui** (UI component library)
- **Electron** (for desktop packaging)
- **Other Libraries**: react-icons, react-player, etc.

---

## Project Structure
```
companion-three-paths-main/
├── public/                # Static assets (images, gifs, videos, favicon)
├── src/
│   ├── components/        # Reusable React components (UI, games, interface)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page-level React components (routes)
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Project metadata and dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── README.md              # Project documentation
```

---

## Media and Photos Used
All media assets are located in the `public/` folder. Here are the main files used:

- **Images & GIFs for Exercises:**
  - `3D.jpg`, `3d.png`, `animal-walks.gif`, `arm-circles.gif`, `Balasana.gif`, `Bridge Pose.gif`, `Butterfly Pose.gif`, `Cobra Pose.gif`, `dead-bug.gif`, `march.gif`, `Mountain Pose.gif`, `neck-rolls.gif`, `side-stepping.gif`, `sit-to-stand.gif`, `toe-touch.gif`, `tree pose.jpg`, `wall-pushups.gif`
- **Yoga & Breathing:**
  - `Bhramari Pranayama.jpg`, `Lotus.jpg`
- **Backgrounds & Videos:**
  - `background.mp4`, `smoke.mp4`, `Sunset.mp4`
- **Icons & Misc:**
  - `favicon.ico`, `placeholder.svg`, `robots.txt`

These assets are used for:
- Exercise and yoga demonstration cards
- Animated backgrounds
- App icon and branding

---

## Development Process
1. **Project Initialization**
   - Created with Vite + React + TypeScript template
   - Tailwind CSS and shadcn-ui set up for styling and UI components
2. **Component Development**
   - Built modular components for exercises, games, and the companion interface
   - Added custom hooks for mobile detection and toast notifications
3. **Media Integration**
   - Added GIFs and images for each exercise and yoga pose
   - Integrated background videos for a rich UI
4. **Countdown and Voice Sync**
   - Implemented a synchronized countdown timer and voice guidance for exercises
5. **Electron Packaging**
   - Added Electron main process (`public/electron.js`)
   - Configured `package.json` for Electron build and packaging
   - Ensured all dependencies needed at runtime (like `electron-is-dev`) are in `dependencies`
   - Built the app as a Windows installer (.exe)

---

## Packaging as a Desktop App
- The app is packaged using Electron and `electron-builder`.
- The build process creates an installer `.exe` in the `dist-electron/` folder.
- The installer can be shared and run on any Windows 10/11 machine.

---

## How to Build and Run

### 1. Install dependencies
```bash
npm install
```

### 2. Build the React app
```bash
npm run build
```

### 3. Package as a Windows app
```bash
npm run electron-pack
```

### 4. Find your installer
- Go to `dist-electron/Companion App Setup 0.0.0.exe`
- Double-click to install

### 5. Share the installer
- You can send the `.exe` to others for installation

---

## Troubleshooting
- **Blank window in Electron:** Make sure you built the React app (`npm run build`) before packaging.
- **Missing dependencies error:** Ensure all runtime dependencies (like `electron-is-dev`) are in `dependencies`, not `devDependencies`.
- **Symlink/Code signing error:** Run your terminal as Administrator or add `"sign": false` to your `build.win` config in `package.json`.
- **Icon error:** Use a 256x256 `.ico` file for the app icon in `public/favicon.ico`.

---

## Credits
- All media assets are for demonstration purposes. Replace with your own for production use.
- Built with ❤️ using React, Vite, Tailwind CSS, shadcn-ui, and Electron.
