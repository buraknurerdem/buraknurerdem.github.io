class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "white"
    }
}

export class Graph {
    constructor(onMatrixChange) {
        this.vertices = [];
        this.vertexRadius = 16;
        this.adjacencyMatrix = [[]];
        this.onMatrixChange = onMatrixChange;
    }

    loadFromText(matrix) {

        const graphTextOrder = matrix.length;

        // Add new vertices if new matrix is larger
        for (let i = this.vertices.length; i < graphTextOrder; i++) {
            this.vertices.push(
                new Vertex(
                    Math.cos(Math.PI * 2 * i / graphTextOrder + (Math.PI / 2)) * 100 + 300,
                    Math.sin(Math.PI * 2 * i / graphTextOrder + (Math.PI / 2)) * 100 + 200
                )
            );
        }

        // Remove vertices if new matrix is smaller than the current
        this.vertices.splice(graphTextOrder);

        if (graphTextOrder > 0)
            this.adjacencyMatrix = matrix;
    }

    addVertexAt(x, y) {

        const order = this.vertices.length;

        // Add vertex to vertices
        this.vertices.push(new Vertex(x, y));

        // Update adjacencyMatrix
        this.adjacencyMatrix.forEach(row => row.push(0));
        if (order > 0) {
            const newRow = new Array(order + 1).fill(0);
            this.adjacencyMatrix.push(newRow);
        }

        // Sync using callback updateMatrixTextbox
        if (this.onMatrixChange) {
            this.onMatrixChange(this.adjacencyMatrix);
        }
    }

    deleteVertexAtIndex(ind) {
        // Remove vertex from vertices
        this.vertices.splice(ind, 1);

        // Remove element at ind
        this.adjacencyMatrix.forEach(row => {
            row.splice(ind, 1);
        });
        // Remove row at ind 
        this.adjacencyMatrix.splice(ind, 1)

        // Sync using callback updateMatrixTextbox
        if (this.onMatrixChange) {
            this.onMatrixChange(this.adjacencyMatrix);
        }
    }

    addEdge(v1, v2) {
        this.adjacencyMatrix[v1][v2] = 1;
        this.adjacencyMatrix[v2][v1] = 1;

        // Sync using callback updateMatrixTextbox
        if (this.onMatrixChange) {
            this.onMatrixChange(this.adjacencyMatrix);
        }
    }

    deleteEdge(v1, v2) {
        this.adjacencyMatrix[v1][v2] = 0;
        this.adjacencyMatrix[v2][v1] = 0;

        // Sync using callback updateMatrixTextbox
        if (this.onMatrixChange) {
            this.onMatrixChange(this.adjacencyMatrix);
        }
    }

    clear() {
        this.vertices = [];
        this.adjacencyMatrix = [[]];

        // Sync using callback updateMatrixTextbox
        if (this.onMatrixChange) {
            this.onMatrixChange(this.adjacencyMatrix);
        }
    }

    getOrder() {
        return this.vertices.length;
    }

    getSize() {
        const order = this.vertices.length;
        let size = 0;
        for (var i = 0; i < order; i++) {
            for (var j = i + 1; j < order; j++) {
                if (this.adjacencyMatrix[i][j])
                    size += 1;
            }
        }
        return size;
    }
}


// class Graph {
//     constructor() {
//         this.vertices = []; // { id, x, y }
//         this.edges = []; // [vertex1, vertex2]
//         this.vertexRadius = 16;
//     }

//     loadFromAdjMatrix(matrix) {
//         this.vertices = [];
//         this.edges = [];

//         const size = matrix.length;

//         // Vertices array
//         for (let i = 0; i < size; i++) {
//             this.vertices.push({
//                 id: i,

//                 // Circle Layout
//                 x: Math.cos(Math.PI * 2 * i / size + (Math.PI / 2)) * 100 + 300,
//                 y: Math.sin(Math.PI * 2 * i / size + (Math.PI / 2)) * 100 + 200
//             });
//         }

//         // Edges array
//         for (let i = 0; i < size; i++) {
//             for (let j = i + 1; j < size; j++) {
//                 if (matrix[i][j] === 1) {
//                     this.edges.push([i, j]);
//                 }
//             }
//         }
//     }
// }
