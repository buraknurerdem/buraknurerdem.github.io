import { DragHandler, AddVertexHandler, AddEdgeHandler, DeleteVertexEdgeHandler } from "./handlers.js";

export class GraphCanvas {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.graph = graph;

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        // Pendulum
        this.pendulumX = 16;
        this.pendulumY = 32;
        this.pendulumRadius = 16;
        this.pendulumDirection = 1;

        // Handlers
        this.handlers = {
            drag: {
                handler: new DragHandler(canvas, graph, () => this.render()),
                button: null
            },
            v: {
                handler: new AddVertexHandler(canvas, graph, () => this.render()),
                button: document.getElementById("button_add_vertex")
            },
            e: {
                handler: new AddEdgeHandler(canvas, graph, () => this.render()),
                button: document.getElementById("button_add_edge")
            },
            d: {
                handler: new DeleteVertexEdgeHandler(canvas, graph, () => this.render()),
                button: document.getElementById("button_delete")
            }
        };

        this.activeHandler = this.handlers["drag"].handler;
        this.isKeyHeld = false;
        this.heldKey = null;

        // Listeners
        this.canvas.addEventListener("mousedown", (e) => this.activeHandler.onMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.activeHandler.onMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.activeHandler.onMouseMove(e));
        this.canvas.addEventListener("mouseleave", (e) => this.activeHandler.onMouseLeave(e));

        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));

        for (const { button } of Object.values(this.handlers)) {
            if (button) {
                button.addEventListener("click", (e) => this.buttonToggle(button));
            }
        }

    }

    clearButtonHighlights() {
        for (const { button } of Object.values(this.handlers)) {
            if (button) button.classList.remove("active");
        }
    }

    buttonToggle(button) {

        if (!button.classList.contains("active")) {
            // Activate
            this.clearButtonHighlights();
            button.classList.add("active");

            // Select the active handler
            for (const { handler, button: btn } of Object.values(this.handlers)) {
                if (btn == button) {
                    this.activeHandler = handler;
                    break;
                }
            }
        }
        else {
            // Disactive
            this.clearButtonHighlights();
            button.classList.remove("active");
            this.activeHandler.disengage();
            this.activeHandler = this.handlers["drag"].handler;
        }
    }

    keyDown(evt) {

        const pressedKey = evt.key.toLowerCase();
        if (this.handlers[pressedKey]) {
            if ((!this.isKeyHeld || this.heldKey != pressedKey) && !evt.metaKey) {
                this.clearButtonHighlights();
                this.isKeyHeld = true;
                this.heldKey = pressedKey;

                this.activeHandler = this.handlers[pressedKey].handler;
                this.handlers[pressedKey].button.classList.add("active");
            }
        }
    }

    keyUp(evt) {
        const pressedKey = evt.key.toLowerCase();
        if (this.handlers[pressedKey] && this.isKeyHeld) {
            this.clearButtonHighlights();
            this.isKeyHeld = false;
            this.activeHandler.disengage();
            this.activeHandler = this.handlers["drag"].handler;
        }
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.font = "20px Verdana";
        ctx.textBaseline = "middle";

        // Print Graph Order and Size
        ctx.textAlign = "left";
        ctx.fillText("Order:", 50, 100);
        ctx.fillText("Size:", 50, 130);
        ctx.textAlign = "right";
        const order = this.graph.getOrder();
        const size = this.graph.getSize();
        ctx.fillText(String(order), 160, 100);
        ctx.fillText(String(size), 160, 130);

        ctx.textAlign = "center";

        // Draw edges
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        for (var i = 0; i < order; i++) {
            for (var j = i + 1; j < order; j++) {
                if (this.graph.adjacencyMatrix[i][j]) {
                    const v1 = this.graph.vertices[i];
                    const v2 = this.graph.vertices[j];
                    ctx.beginPath();
                    ctx.moveTo(v1.x, v1.y);
                    ctx.lineTo(v2.x, v2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw vertices
        for (let i = 0; i < order; i++) {
            const vertex = this.graph.vertices[i];
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, this.graph.vertexRadius, 0, Math.PI * 2);

            // Circle background
            ctx.fillStyle = vertex.color;
            ctx.fill();

            // Text
            ctx.fillStyle = "black";
            ctx.fillText(String(i), vertex.x, vertex.y);

            // Circle Border
            ctx.strokeStyle = "black";
            ctx.stroke();
        }

        // Pendulum
        ctx.beginPath();
        ctx.arc(this.pendulumX, this.pendulumY, this.pendulumRadius, 0, Math.PI * 2);

        // Circle background
        ctx.fillStyle = "white";
        ctx.fill();

        // Text
        ctx.fillStyle = "black";

        ctx.fillText("P", this.pendulumX, this.pendulumY);

        // Circle Border
        ctx.strokeStyle = "black";
        ctx.stroke();

        if (this.pendulumDirection) {
            this.pendulumX += 3;
            if (this.pendulumX >= this.canvas.width - this.pendulumRadius) { this.pendulumDirection = 0 }
        }
        else {
            this.pendulumX -= 3;
            if (this.pendulumX < this.pendulumRadius) { this.pendulumDirection = 1 }
        }

    }
}
