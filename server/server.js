const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const state = require('./drawing-state');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(express.static(path.join(__dirname, '../client')));

const COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF',
    '#33FFF3', '#F3FF33', '#FF3380', '#FF9633'
];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Assign a random color and name to the user
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const user = {
        name: `User ${socket.id.substr(0, 4)}`,
        color: color,
        x: 0,
        y: 0
    };

    state.addUser(socket.id, user);

    // Send current state to the new user
    socket.emit('init', state.getState());

    // Notify others about the new user
    socket.broadcast.emit('user-joined', { id: socket.id, ...user });

    // Handle incoming drawing data (live preview)
    socket.on('draw-move', (data) => {
        // Broadcast point to others for live preview
        socket.broadcast.emit('draw-move', {
            userId: socket.id,
            ...data
        });
    });

    // Handle completed strokes
    socket.on('draw-end', (stroke) => {
        state.addStroke({ userId: socket.id, ...stroke });
        io.emit('canvas-update', state.history);
    });

    // Handle undo
    socket.on('undo', () => {
        if (state.undo()) {
            io.emit('canvas-update', state.history);
        }
    });

    // Handle redo
    socket.on('redo', () => {
        if (state.redo()) {
            io.emit('canvas-update', state.history);
        }
    });

    // Handle clear
    socket.on('clear', () => {
        state.clear();
        io.emit('canvas-update', state.history);
    });

    // Handle cursor movement
    socket.on('cursor-move', (data) => {
        state.updateUserCursor(socket.id, data.x, data.y);
        socket.broadcast.emit('cursor-move', {
            id: socket.id,
            x: data.x,
            y: data.y
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        state.removeUser(socket.id);
        io.emit('user-left', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
