# Co-Draw | Collaborative Drawing Canvas

A multi-user drawing application with real-time synchronization, cursor tracking, and global undo/redo.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```
   *Note: If `npm start` isn't configured, use `node server/server.js`*

3. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in multiple browser tabs to test collaboration.

## Features

- **Real-Time Sync**: Watch others draw point-by-point.
- **User Indicators**: See where others are pointing with labeled cursors.
- **Global Undo/Redo**: Undo actions across all connected users.
- **Premium UI**: Dark-themed, glassmorphic design for a modern feel.
- **Tools**: Brush, Eraser, Color presets, and Stroke width adjustment.

## How to Test with Multiple Users

1. Open the application in Tab A.
2. Open the application in Tab B.
3. Move your mouse in Tab A - you will see a "User XXXX" cursor move in Tab B.
4. Draw a line in Tab A - it will appear instantly in Tab B.
5. Click "Undo" in Tab B - the line drawn in Tab A will disappear for everyone.

## Known Limitations

- **Canvas Scaling**: If users have wildly different window sizes, the drawing coordinates are absolute. Best viewed on similar screen sizes.
- **History Size**: Very long drawing sessions with thousands of strokes may eventually slow down the initial catch-up and redraw.

## Time Spent
- Planning & Setup: 15 mins
- Backend Implementation: 30 mins
- Frontend Engine & UI: 45 mins
- Documentation & Polishing: 20 mins
- **Total**: ~1 hour 50 mins
