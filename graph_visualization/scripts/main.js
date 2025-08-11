import { GraphCanvas } from './canvas.js'
import { Graph } from './graph.js'
import Resizer from './resizer.js'

const canvasElement = document.getElementById("canvas");
const textAdjMat = document.getElementById("text_adj_mat");
const buttonUpdateFromText = document.getElementById("button_update_adj_mat");
const buttonClearGraph = document.getElementById("button_clear_graph");

// Convert textarea text to matrix
function parseAdjMatrix(text) {
    // Return empty array if textarea is empty
    if (!text.trim()) {
        return [];
    }

    return text.trim().split("\n").map(row =>
        row.split(",").map(v => parseInt(v.trim()) || 0)
    );
}

// Update text adjacency matrix from graph object.
function updateMatrixTextbox(matrix) {
    const textarea = document.getElementById("text_adj_mat");
    textarea.value = matrix
        .map(row => row.join(","))
        .join("\n");
}

const graph = new Graph(updateMatrixTextbox);
const graphCanvas = new GraphCanvas(canvasElement, graph);
document.addEventListener("DOMContentLoaded", () => {
    new Resizer(document, graphCanvas);
})

// Button: Update button. graph from textarea
buttonUpdateFromText.addEventListener("click", () => {
    const matrix = parseAdjMatrix(textAdjMat.value);
    graph.loadFromText(matrix);
    graphCanvas.render();
});

// Initial Click for loadingn the initial graph
buttonUpdateFromText.click();


// Button: Clear graph
buttonClearGraph.addEventListener("click", () => {
    graph.clear();
    graphCanvas.render();
});
