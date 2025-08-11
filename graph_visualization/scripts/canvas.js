import { getEdgeAtPosition, getMousePosition, getVertexAtPosition, getVertexIndexAtPosition, isPointCloseToLineSegment } from "./utils.js"

class DragHandler {
    constructor(canvas, graph, onUpdate) {
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;

        this.isDraggingVertex = false;
        this.draggedVertex = null;

        this.clickOffset = { x: 0, y: 0 }

        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.canvas.addEventListener("mouseleave", (e) => this.onMouseUp(e));
    }

    onMouseDown(evt) {
        const pos = getMousePosition(this.canvas, evt);
        const vertex = getVertexAtPosition(this.graph, pos.x, pos.y);
        if (vertex) {
            this.isDraggingVertex = true;
            this.draggedVertex = vertex;
            this.clickOffset.x = pos.x - vertex.x;
            this.clickOffset.y = pos.y - vertex.y;
        }
    }

    onMouseUp(evt) {
        this.isDraggingVertex = false;
        this.draggedVertex = null;
    }

    onMouseMove(evt) {

        if (this.isDraggingVertex) {
            const pos = getMousePosition(this.canvas, evt);
            this.draggedVertex.x = pos.x - this.clickOffset.x;
            this.draggedVertex.y = pos.y - this.clickOffset.y;
            this.onUpdate();
        }
    }
}

class AddVertexHandler {
    constructor(canvas, graph, onUpdate, toggleButton) {
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;
        this.toggleButton = toggleButton;

        this.buttonEnabled = false;
        this.keyHeld = false;

        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));

        this.toggleButton.addEventListener("click", this.onButtonClick.bind(this));
    }

    addVertexEnabled() {
        return (this.keyHeld || this.buttonEnabled);
    }

    updateButtonVisual() {
        if (this.addVertexEnabled()) {
            this.toggleButton.classList.add("active");
        }
        else {
            this.toggleButton.classList.remove("active");
        }
    }

    keyDown(evt) {
        if (evt.key.toLowerCase() === "v") {
            if (!this.keyHeld) {
                this.keyHeld = true;
                this.updateButtonVisual();
            }
        }
    }

    keyUp(evt) {
        if (evt.key.toLowerCase() === "v") {
            if (this.keyHeld || this.buttonEnabled) {
                this.buttonEnabled = false;
                this.keyHeld = false;
                this.updateButtonVisual();
            }
        }
    }

    onButtonClick() {
        this.buttonEnabled = !this.buttonEnabled;
        this.updateButtonVisual();
    }

    onMouseDown(evt) {
        if (this.addVertexEnabled()) {

            // const rect = this.canvas.getBoundingClientRect();
            // const mouseX = evt.clientX - rect.left;
            // const mouseY = evt.clientY - rect.top;
            const pos = getMousePosition(this.canvas, evt);

            // this.graph.vertices.push(new Vertex("n", mouseX, mouseY));
            this.graph.addVertexAt(pos.x, pos.y);
            this.onUpdate();
        }
    }
}

class AddEdgeHandler {
    constructor(canvas, graph, onUpdate, toggleButton) {
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;
        this.toggleButton = toggleButton;

        this.buttonEnabled = false;
        this.keyHeld = false;

        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));

        this.toggleButton.addEventListener("click", this.onButtonClick.bind(this));

        this.v1 = -1;
        this.v2 = -1;

    }

    addEdgeEnabled() {
        return (this.keyHeld || this.buttonEnabled);
    }

    updateButtonVisual() {
        if (this.addEdgeEnabled()) {
            this.toggleButton.classList.add("active");
        }
        else {
            this.toggleButton.classList.remove("active");
        }
    }

    keyDown(evt) {
        if (evt.key.toLowerCase() === "e") {
            if (!this.keyHeld) {
                this.keyHeld = true;
                this.updateButtonVisual();
            }
        }
    }

    keyUp(evt) {
        if (evt.key.toLowerCase() === "e") {
            if (this.keyHeld || this.buttonEnabled) {
                this.buttonEnabled = false;
                this.keyHeld = false;
                this.updateButtonVisual();
                if (this.v1 != -1) {
                    this.graph.vertices[this.v1].color = "white";
                }
                this.v1 = -1;
                this.v2 = -1;
                this.onUpdate();
            }
        }
    }

    onButtonClick() {
        this.buttonEnabled = !this.buttonEnabled;
        this.updateButtonVisual();
    }

    onMouseDown(evt) {
        if (!this.addEdgeEnabled()) {
            return;
        }
        const pos = getMousePosition(this.canvas, evt);
        if (this.v1 != -1) {
            this.v2 = getVertexIndexAtPosition(this.graph, pos.x, pos.y);

            if (this.v2 != -1 && this.v1 != this.v2) {
                // Add edge
                this.graph.addEdge(this.v1, this.v2);

                // Reset vertex indices, colors
                this.graph.vertices[this.v1].color = "white";
                this.v1 = -1;
                this.v2 = -1;
            }
        }
        else {
            // Choose v1
            this.v1 = getVertexIndexAtPosition(this.graph, pos.x, pos.y);
            if (this.v1 != -1) {
                this.graph.vertices[this.v1].color = "blue";
            }
        }
        this.onUpdate();
    }
}

class DeleteVertexEdgeHandler {
    constructor(canvas, graph, onUpdate, toggleButton) {
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;
        this.toggleButton = toggleButton;

        this.buttonEnabled = false;
        this.keyHeld = false;
        this.isMouseDown = false;

        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));

        this.toggleButton.addEventListener("click", this.onButtonClick.bind(this));
    }

    deleteEnabled() {
        return (this.keyHeld || this.buttonEnabled);
    }

    updateButtonVisual() {
        if (this.deleteEnabled()) {
            this.toggleButton.classList.add("active");
        }
        else {
            this.toggleButton.classList.remove("active");
        }
    }

    keyDown(evt) {
        if (evt.key.toLowerCase() === "d") {
            if (!this.keyHeld) {
                this.keyHeld = true;
                this.updateButtonVisual();
            }
        }
    }

    keyUp(evt) {
        if (evt.key.toLowerCase() === "d") {
            if (this.keyHeld || this.buttonEnabled) {
                this.buttonEnabled = false;
                this.keyHeld = false;
                this.updateButtonVisual();
                this.onUpdate();
            }
        }
    }

    onButtonClick() {
        this.buttonEnabled = !this.buttonEnabled;
        this.updateButtonVisual();
    }

    onMouseDown(evt) {
        this.isMouseDown = true;
        if (this.deleteEnabled()) {

            const pos = getMousePosition(this.canvas, evt);

            // Vertex Deletion
            const vertexIndex = getVertexIndexAtPosition(this.graph, pos.x, pos.y);
            if (vertexIndex != -1) {
                this.graph.deleteVertexAtIndex(vertexIndex);
                this.onUpdate();
            }

            // Edge Deletion
            const edge = getEdgeAtPosition(this.graph, pos)
            if(edge) {
                this.graph.deleteEdge(edge.v1, edge.v2);
                this.onUpdate();
            }
        }
    }

    onMouseMove (evt) {
        if (this.deleteEnabled() && this.isMouseDown) {

            const pos = getMousePosition(this.canvas, evt);

            // Vertex Deletion
            const vertexIndex = getVertexIndexAtPosition(this.graph, pos.x, pos.y);
            if (vertexIndex != -1) {
                this.graph.deleteVertexAtIndex(vertexIndex);
                this.onUpdate();
            }

            // Edge Deletion
            const edge = getEdgeAtPosition(this.graph, pos)
            if(edge) {
                this.graph.deleteEdge(edge.v1, edge.v2);
                this.onUpdate();
            }
        }
    }

    onMouseUp(evt) {
        this.isMouseDown = false;
    }
}

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
        this.dragHandler = new DragHandler(canvas, graph, () => this.render());

        const buttonAddVertex = document.getElementById("button_add_vertex");
        this.addVertexHandler = new AddVertexHandler(canvas, graph, () => this.render(), buttonAddVertex);

        const buttonAddEdge = document.getElementById("button_add_edge");
        this.addVertexHandler = new AddEdgeHandler(canvas, graph, () => this.render(), buttonAddEdge);

        const buttonDeleteVertexEdge = document.getElementById("button_delete");
        this.deleteVertexEdgeHandler = new DeleteVertexEdgeHandler(canvas, graph, () => this.render(), buttonDeleteVertexEdge);
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
