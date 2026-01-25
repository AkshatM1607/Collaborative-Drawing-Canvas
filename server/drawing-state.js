class DrawingState {
    constructor() {
        this.history = []; // Array of completed strokes
        this.redoStack = []; // Array of undone strokes
        this.users = new Map(); // socket.id -> { name, color, x, y }
    }

    addStroke(stroke) {
        this.history.push(stroke);
        this.redoStack = []; // Clear redo stack on new action
    }

    undo() {
        if (this.history.length > 0) {
            const lastStroke = this.history.pop();
            this.redoStack.push(lastStroke);
            return true;
        }
        return false;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const stroke = this.redoStack.pop();
            this.history.push(stroke);
            return true;
        }
        return false;
    }

    clear() {
        this.history = [];
        this.redoStack = [];
    }

    addUser(id, user) {
        this.users.set(id, user);
    }

    updateUserCursor(id, x, y) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            user.x = x;
            user.y = y;
        }
    }

    removeUser(id) {
        this.users.delete(id);
    }

    getUsers() {
        return Array.from(this.users.entries()).map(([id, data]) => ({ id, ...data }));
    }

    getState() {
        return {
            history: this.history,
            users: this.getUsers()
        };
    }
}

module.exports = new DrawingState();
