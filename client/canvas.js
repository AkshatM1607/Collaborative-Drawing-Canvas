class CanvasEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentStroke = [];
        this.tool = 'brush'; // 'brush' or 'eraser'
        this.color = '#ffffff';
        this.lineWidth = 5;
        this.onStrokeEnd = null; // Callback for when a stroke is finished
        this.onDrawMove = null; // Callback for live updates

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        // Redraw will be triggered by main.js after resize if history exists
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.currentStroke = [{ x: pos.x, y: pos.y }];

        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.strokeStyle = this.tool === 'eraser' ? '#0d1117' : this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getMousePos(e);
        this.currentStroke.push({ x: pos.x, y: pos.y });

        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        if (this.onDrawMove) {
            this.onDrawMove({
                point: pos,
                tool: this.tool,
                color: this.color,
                lineWidth: this.lineWidth
            });
        }
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        if (this.onStrokeEnd && this.currentStroke.length > 0) {
            this.onStrokeEnd({
                points: this.currentStroke,
                tool: this.tool,
                color: this.color,
                lineWidth: this.lineWidth
            });
        }
        this.currentStroke = [];
    }

    // Draw a single stroke (used for updates from other users)
    drawStroke(stroke) {
        if (!stroke.points || stroke.points.length === 0) return;

        this.ctx.beginPath();
        this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        this.ctx.strokeStyle = stroke.tool === 'eraser' ? '#0d1117' : stroke.color;
        this.ctx.lineWidth = stroke.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        for (let i = 1; i < stroke.points.length; i++) {
            this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        this.ctx.stroke();
    }

    // Draw a live point from another user
    drawRemotePoint(data) {
        this.ctx.beginPath();
        // This is a simplified live draw - ideally we'd track remote paths per user
        // But for simplicity, we just draw small segments
        this.ctx.strokeStyle = data.tool === 'eraser' ? '#0d1117' : data.color;
        this.ctx.lineWidth = data.lineWidth;
        this.ctx.lineCap = 'round';

        // We lack the 'previous point' here without tracking, 
        // so we'll just draw a very small line or dot
        this.ctx.arc(data.point.x, data.point.y, data.lineWidth / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.fill();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redraw(history) {
        this.clear();
        history.forEach(stroke => this.drawStroke(stroke));
    }
}

// Export for use in main.js
window.CanvasEngine = CanvasEngine;
