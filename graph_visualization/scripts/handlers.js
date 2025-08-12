import { getEdgeAtPosition, getMousePosition, getVertexAtPosition, getVertexIndexAtPosition } from "./utils.js"

class Handler {
    constructor() {

    }
    onMouseDown() { }
    onMouseUp() { }
    onMouseMove() { }
    onMouseLeave() { }
    disengage() { }
}

export class DragHandler extends Handler {
    constructor(canvas, graph, onUpdate) {
        super();
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;

        this.isDraggingVertex = false;
        this.draggedVertex = null;

        this.clickOffset = { x: 0, y: 0 }
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

    onMouseLeave(evt) {
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

export class AddVertexHandler extends Handler {
    constructor(canvas, graph, onUpdate) {
        super();
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;
    }

    onMouseDown(evt) {
        const pos = getMousePosition(this.canvas, evt);
        this.graph.addVertexAt(pos.x, pos.y);
        this.onUpdate();
    }
}

export class AddEdgeHandler extends Handler {
    constructor(canvas, graph, onUpdate) {
        super();
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;

        this.v1 = -1;
        this.v2 = -1;
    }

    disengage() {
        if (this.v1 != -1) {
            this.graph.vertices[this.v1].color = "white";
        }
        this.v1 = -1;
        this.v2 = -1;
        this.onUpdate();
    }


    onMouseDown(evt) {
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

export class DeleteVertexEdgeHandler extends Handler {
    constructor(canvas, graph, onUpdate) {
        super();
        this.canvas = canvas;
        this.graph = graph;
        this.onUpdate = onUpdate;

        this.isMouseDown = false;

    }

    onMouseDown(evt) {
        this.isMouseDown = true;

        const pos = getMousePosition(this.canvas, evt);

        // Vertex Deletion
        const vertexIndex = getVertexIndexAtPosition(this.graph, pos.x, pos.y);
        if (vertexIndex != -1) {
            this.graph.deleteVertexAtIndex(vertexIndex);
            this.onUpdate();
            return;
        }

        // Edge Deletion
        const edge = getEdgeAtPosition(this.graph, pos)
        if (edge) {
            this.graph.deleteEdge(edge.v1, edge.v2);
            this.onUpdate();
        }
    }

    onMouseMove(evt) {
        if (this.isMouseDown) {

            const pos = getMousePosition(this.canvas, evt);

            // Vertex Deletion
            const vertexIndex = getVertexIndexAtPosition(this.graph, pos.x, pos.y);
            if (vertexIndex != -1) {
                this.graph.deleteVertexAtIndex(vertexIndex);
                this.onUpdate();
                return;
            }

            // Edge Deletion
            const edge = getEdgeAtPosition(this.graph, pos)
            if (edge) {
                this.graph.deleteEdge(edge.v1, edge.v2);
                this.onUpdate();
            }
        }
    }

    onMouseUp(evt) {
        this.isMouseDown = false;
    }
}