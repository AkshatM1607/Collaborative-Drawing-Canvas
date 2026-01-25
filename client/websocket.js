class SocketClient {
    constructor() {
        this.socket = io();
        this.handlers = {};
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    emit(event, data) {
        this.socket.emit(event, data);
    }

    get id() {
        return this.socket.id;
    }
}

window.SocketClient = SocketClient;
