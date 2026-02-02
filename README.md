# Co-Draw

A real-time collaborative drawing application built with Node.js and Socket.io.

## Features

- **Real-Time Synchronization**: Seamlessly draw with multiple users simultaneously.
- **Cursor Tracking**: Live visibility of other users' cursor positions with labeled indicators.
- **Global Undo/Redo**: Shared history state allowing for collaborative corrections.
- **Modern Interface**: Clean, dark-themed UI with glassmorphic accents.
- **Drawing Tools**: Customizable brush size, eraser mode, and a curated color palette.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AkshatM1607/Collaborative-Drawing-Canvas.git
   cd Collaborative-Drawing-Canvas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application will be accessible at `http://localhost:3000`.

## Technical Overview

- **Frontend**: Vanilla JavaScript with HTML5 Canvas API.
- **Backend**: Node.js and Express.
- **Communication**: Socket.io for low-latency WebSocket communication.
- **State Management**: Server-side history with broadcast synchronization for consistency across all clients.

## License

This project is open-source and available under the [MIT License](LICENSE).
