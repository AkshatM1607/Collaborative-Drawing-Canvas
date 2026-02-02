document.addEventListener('DOMContentLoaded', () => {
    const canvas = new CanvasEngine('main-canvas');
    const client = new SocketClient();
    const cursorsContainer = document.getElementById('cursors-container');
    const userListElement = document.getElementById('user-list');
    const selfNameElement = document.getElementById('self-name');
    const selfColorElement = document.getElementById('self-color');

    let remoteCursors = {};
    let users = {};

    // UI Elements
    const toolBrush = document.getElementById('tool-brush');
    const toolEraser = document.getElementById('tool-eraser');
    const colorPicker = document.getElementById('color-picker');
    const colorPresets = document.querySelectorAll('.color-preset');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    const btnClear = document.getElementById('btn-clear');

    // Event Listeners
    toolBrush.onclick = () => {
        canvas.tool = 'brush';
        toolBrush.classList.add('active');
        toolEraser.classList.remove('active');
    };

    toolEraser.onclick = () => {
        canvas.tool = 'eraser';
        toolEraser.classList.add('active');
        toolBrush.classList.remove('active');
    };

    colorPicker.oninput = (e) => {
        canvas.color = e.target.value;
        colorPresets.forEach(p => p.classList.remove('active'));
    };

    colorPresets.forEach(preset => {
        preset.onclick = () => {
            const color = preset.dataset.color;
            canvas.color = color;
            colorPicker.value = color;
            colorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        };
    });

    sizeSlider.oninput = (e) => {
        const val = e.target.value;
        canvas.lineWidth = val;
        sizeValue.innerText = `${val}px`;
    };

    btnUndo.onclick = () => client.emit('undo');
    btnRedo.onclick = () => client.emit('redo');
    btnClear.onclick = () => {
        if (confirm('Clear canvas for everyone?')) {
            client.emit('clear');
        }
    };

    // Canvas Engine Callbacks
    canvas.onDrawMove = (data) => {
        client.emit('draw-move', data);
    };

    canvas.onStrokeEnd = (stroke) => {
        client.emit('draw-end', stroke);
    };

    // Track local cursor
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.canvas.getBoundingClientRect();
        client.emit('cursor-move', {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    });

    // Socket events
    client.on('init', (data) => {
        users = {};
        data.users.forEach(u => {
            users[u.id] = u;
            if (u.id === client.id) {
                selfNameElement.innerText = u.name;
                selfColorElement.style.background = u.color;
            }
        });
        updateUserList();
        canvas.redraw(data.history);
    });

    client.on('canvas-update', (history) => {
        canvas.redraw(history);
    });

    client.on('draw-move', (data) => {
        canvas.drawRemotePoint(data);
    });

    client.on('user-joined', (user) => {
        users[user.id] = user;
        updateUserList();
    });

    client.on('user-left', (id) => {
        delete users[id];
        if (remoteCursors[id]) {
            remoteCursors[id].remove();
            delete remoteCursors[id];
        }
        updateUserList();
    });

    client.on('cursor-move', (data) => {
        updateRemoteCursor(data.id, data.x, data.y);
    });

    // --- Helper Functions ---
    function updateUserList() {
        userListElement.innerHTML = '';
        Object.values(users).forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item';
            li.innerHTML = `
                <span class="user-color-dot" style="background: ${user.color}"></span>
                <span>${user.name} ${user.id === client.id ? '(You)' : ''}</span>
            `;
            userListElement.appendChild(li);
        });
    }

    function updateRemoteCursor(id, x, y) {
        if (id === client.id) return;

        let cursor = remoteCursors[id];
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'remote-cursor';
            cursor.innerHTML = `
                <div class="cursor-pointer"></div>
                <div class="cursor-label"></div>
            `;
            cursorsContainer.appendChild(cursor);
            remoteCursors[id] = cursor;
        }

        const user = users[id];
        if (user) {
            cursor.style.color = user.color;
            cursor.querySelector('.cursor-label').innerText = user.name;
        }

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    }
});
