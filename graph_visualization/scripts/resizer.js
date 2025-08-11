export default class Resizer {
    constructor(document, graphCanvas) {
        this.leftPanel = document.querySelector('.left_panel');
        this.resizer = document.querySelector('.resizer');
        this.graphCanvas = graphCanvas;
        this.isResizing = false;

        // this.minWidth = 150;
        // this.maxWidth = 400;
        this.minWidth = window.innerWidth * 0;
        this.maxWidth = window.innerWidth * 0.5;

        this.attachEvents(document);
    }

    attachEvents(document) {
        this.resizer.addEventListener('mousedown', (e) => {
            this.isResizing = true;
            document.body.style.cursor = 'col-resize';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing) return;

            const newWidth = Math.min(Math.max(e.clientX, this.minWidth), this.maxWidth);
            this.leftPanel.style.flex = `0 0 ${newWidth}px`;
            this.graphCanvas.resizeCanvas();
        });

        document.addEventListener('mouseup', () => {
            if (this.isResizing) {
                this.isResizing = false;
                document.body.style.cursor = '';
            }
        });
    }
}
