export function getMousePosition(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

export function getVertexAtPosition(graph, x, y) {
    return graph.vertices.find(vertex => {
        const dx = vertex.x - x;
        const dy = vertex.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= (graph.vertexRadius + 2);
    })
}

export function getVertexIndexAtPosition(graph, x, y) {
    return graph.vertices.findIndex(vertex => {
        const dx = vertex.x - x;
        const dy = vertex.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= (graph.vertexRadius + 2);
    })
}

export function isPointCloseToLineSegment(a, b, pos, tolerance) {

    // Calculate projection factor t
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const squaredLengthLineSeg = dx * dx + dy * dy;
    const t = ((pos.x - a.x) * dx + (pos.y - a.y) * dy) / squaredLengthLineSeg;

    // if projection is not on line segment, return false.
    if (t < 0 || t > 1) return false;

    // find closest point on line segment to pos. denoted by c
    const cx = (b.x - a.x) * t + a.x;
    const cy = (b.y - a.y) * t + a.y;


    // Calculate the distance between cx and cy.
    const distanceSquaredToLineSeg = (pos.x - cx) * (pos.x - cx) + (pos.y - cy) * (pos.y - cy);

    if (distanceSquaredToLineSeg < tolerance * tolerance) return true;
    else return false;

}

export function getEdgeAtPosition(graph, pos) {
    const order = graph.vertices.length;
    for (let i = 0; i < order; i++) {
        for (let j = i + 1; j < order; j++) {
            if (!graph.adjacencyMatrix[i][j])
                continue;

            const v1Coord = {
                x: graph.vertices[i].x,
                y: graph.vertices[i].y
            }
            const v2Coord = {
                x: graph.vertices[j].x,
                y: graph.vertices[j].y
            }
            // Hardcoded tolerance for distance check
            const tolerance = 10;
            if (isPointCloseToLineSegment(v1Coord, v2Coord, pos, tolerance)) {
                console.log(i, j)
                // graph.deleteEdge(i, j);
                return {v1:i, v2:j};
            }
        }
    }

    return null;
}