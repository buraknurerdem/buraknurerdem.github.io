import React from "react";
import p5 from 'p5';

let moving_vertex = null; //will hold the vertex that is clicked and dragged

class Graph{
    constructor(vlist, elist, id){
        this.vertex_list = (vlist);
        this.edge_list = (elist);
    }
}
    
class Vertex{
    constructor(x, y, id){
        this.id = id;
        this.corx = x;
        this.cory = y;
        this.rad = 10;
        this.force = [0, 0];
    }
    is_clicked = function (x, y){
            let distance = Math.sqrt(((this.corx - x) ** 2) + ((this.cory - y) ** 2))
            if(distance <= this.rad) { return true }
            else { return false }
    }
    update_loc = function (x, y){this.corx = x; this.cory = y};
}

// Not versatile!! Update
function generate_planar_graph(no_of_ver){
    let vlist = [];
    let elist = [];
    let slopes = [];
    let intercepts = [];
    for(let i = 0; i < no_of_ver ; i++){
        const angle = Math.random()
        const slope = Math.tan(angle * Math.PI)
        slopes[i] = slope
        intercepts[i] = i * 100
    }
    // loop over every line, then loop again for every line. skip on the same
    // solve for vertices add edges between those on the same line.
    let vlist_index = 0
    let edge_matrix = [];
    for(let i = 0; i < no_of_ver ; i++){
        let temp_row = [];
        for(let j = 0; j < no_of_ver ; j++){
            if(i==j){continue;}
            const tempx = (intercepts[j]- intercepts[i]) / (slopes [i] - slopes [j]);
            const tempy = slopes [i] * tempx + intercepts[i];

            //create vertices
            if(j>i){
                vlist[vlist_index] = new Vertex(tempx, tempy, [i, j])
                vlist_index++
            }
            temp_row.push([i, j])
        }
        edge_matrix.push(temp_row)
    }
    
    for(let i = 0; i < edge_matrix.length; i++){
        for(let j = 1; j < edge_matrix.length - 1; j++){
            //if( j == 0 ){continue;}
            elist.push([edge_matrix[i][j-1], edge_matrix[i][j]])
        }
    }

    for(let i = 0; i < vlist.length; i++){
        for(let j = 0; j < elist.length; j++){
            if((elist[j][0][0] == vlist[i].id[0] && elist[j][0][1] == vlist[i].id[1])|| 
            (elist[j][0][1] == vlist[i].id[0] && elist[j][0][0] == vlist[i].id[1])){
                elist[j][0] = i
            }
            if((elist[j][1][0] == vlist[i].id[0] && elist[j][1][1] == vlist[i].id[1])|| 
            (elist[j][1][1] == vlist[i].id[0] && elist[j][1][0] == vlist[i].id[1])){
                elist[j][1] = i
            }
        }
    }
    // Scaling coordinates
    let corxs = [];
    for(let i of vlist){corxs.push(i.corx);}
    let corys = [];
    for(let i of vlist){corys.push(i.cory);}
    let max_y = Math.max(...corys);
    let min_y = Math.min(...corys);
    let max_x = Math.max(...corxs);
    let min_x = Math.min(...corxs);

    for(let i of vlist){i.corx = (i.corx - min_x) / (max_x - min_x) * 500 + 100;}
    for(let i of vlist){i.cory = (i.cory - min_y) / (max_y - min_y) * 500 + 100;}


    let coxs = [];
    for(let i of vlist){coxs.push(i.corx);}
    let coys = [];
    for(let i of vlist){coys.push(i.cory);}
    max_y = Math.max(...coys);
    min_y = Math.min(...coys);
    max_x = Math.max(...coxs);
    min_x = Math.min(...coxs);

    return new Graph(vlist, elist, 1);
}

// Euclidean Distance Between Two Vertices
function euc_distance(v1, v2){
    return Math.sqrt((v1.corx - v2.corx) ** 2 + (v1.cory - v2.cory) ** 2)
}

// Implementation of Hooke's Law. It enables 
// elasticity between vertices with respect to their edges.
function hookes_law(graph, stable_length = 100, k_const = 0.2){
    let vlist = graph.vertex_list;
    let elist = graph.edge_list;
    for(let e of elist){
        const v1 = vlist[e[0]];
        const v2 = vlist[e[1]];
        const dist = euc_distance(v1, v2)
        const force = (dist - stable_length) * k_const
        const xdir = (v2.corx - v1.corx) / (dist + Number.EPSILON)
        const ydir = (v2.cory - v1.cory) / (dist + Number.EPSILON)
        v1.force[0] += xdir * force
        v1.force[1] += ydir * force
        v2.force[0] -= xdir * force
        v2.force[1] -= ydir * force
    }
    for(let v of vlist){
        v.corx += v.force[0]
        v.cory += v.force[1]
        v.force = [0,0]
    }
}

// Implementation of Coulomb' law. Vertices in the same graph repel each other.
// Currently, there is no interaction between seperate graphs.
function coulombs_law(graph, k_const = 50000){
    for(let i = 0; i < graph.vertex_list.length; i++){
        for(let j = i + 1; j < graph.vertex_list.length; j++){
            const v1 = graph.vertex_list[i]
            const v2 = graph.vertex_list[j]
            const dist = euc_distance(v1, v2);
            const force = k_const / ((dist) ** 2 + Number.EPSILON)
            const xdir = (v2.corx - v1.corx) / (dist)
            const ydir = (v2.cory - v1.cory) / (dist)
            v1.force[0] -= xdir * force
            v1.force[1] -= ydir * force
            v2.force[0] += xdir * force
            v2.force[1] += ydir * force
        }
    }
    for(let v of graph.vertex_list){
        v.corx += v.force[0]
        v.cory += v.force[1]
        v.force = [0,0]
    }
}

// K_n Generation at a location with some radius
function generate_complete_graph(no_of_ver, centerX, centerY, radius){
    let vlist = [];
    let elist = [];
    for(let i = 0; i < no_of_ver ; i++){
        const vx = centerX + radius * Math.cos( i / no_of_ver * Math.PI * 2);
        const vy = centerY + radius * Math.sin( i / no_of_ver * Math.PI * 2);
        vlist[i] = new Vertex(vx, vy, [0, 0]);
    }
    let temp_index = 0;
    for(let i = 0; i < vlist.length; i++){
        for(let j = i + 1; j < vlist.length; j++){
            elist[temp_index] = [i, j];
            temp_index++;
        }
    }
    return new Graph(vlist, elist, 1);
}

// C_n Generation
function generate_cycle_graph(no_of_ver, centerX = 100, centerY = 100, radius = 100){
    let vlist = [];
    let elist = [];

    for(let i = 0; i < no_of_ver; i++){
        const vx = centerX + radius * Math.cos(i / no_of_ver * Math.PI * 2);
        const vy = centerY + radius * Math.sin(i / no_of_ver * Math.PI * 2);
        
        vlist[i] = new Vertex(vx, vy, [0, 0])
    }
    for(let i = 0; i < no_of_ver - 1; i++){
        elist[i] = [i, i + 1];
    }
    elist[no_of_ver - 1] = [no_of_ver - 1, 0];

    return new Graph(vlist, elist, 1)
}

function drawVertices(graph, s){
    let vlist = graph.vertex_list;
    for(let i = 0; i < vlist.length; i++){
        const v = vlist[i];
        s.fill(0, 0, 255);
        s.circle(v.corx, v.cory, 2 * v.rad);
    };
}

function drawEdges(graph, s){
    let vlist = graph.vertex_list;
    let elist = graph.edge_list;
    for(let i = 0; i < elist.length; i++){
        const v1 = vlist[elist[i][0]]
        const v2 = vlist[elist[i][1]]
        s.line(v1.corx, v1.cory, v2.corx, v2.cory);
    };
}

///////// MAIN //////////

let canvas_width = 1420;
let canvas_height = 700;

let graphs = []

// One Planar
graphs.push(generate_planar_graph(5));

// One Complete
graphs.push(generate_complete_graph(5, canvas_width/2, canvas_height/2, 100));

// One Cycle
graphs.push(generate_cycle_graph(10, canvas_width/2, canvas_height/2, 100));


class GraphVis extends React.Component {
    constructor(props) {
      super(props)
      this.myRef = React.createRef()
    }
  
    sketch = (p) => {
  
        p.setup = () => {
            const cnv = p.createCanvas(canvas_width, canvas_height);
            cnv.position(0,100);
            p.strokeWeight(2);
        }

        p.draw = () => {
            p.clear();
            p.background('white');
            let temp_counter = 0;
            for(let g of graphs){
                hookes_law(g, 100, 0.3);
                coulombs_law(g);
                drawEdges(g, p);
                drawVertices(g, p);
            }
        }

        p.mouseDragged = () => {
            if (moving_vertex != null){
                moving_vertex.update_loc(p.mouseX, p.mouseY);
            }
        }

        p.mousePressed = () => {
            for(let g of graphs){
                for (let i = 0; i < g.vertex_list.length; i++) {
                    if (g.vertex_list[i].is_clicked(p.mouseX, p.mouseY)){
                        moving_vertex = g.vertex_list[i];
                    }
                }
            }
        }

        p.mouseReleased = () => {
            moving_vertex = null;
        }
    }
  
    componentDidMount() {
      this.myP5 = new p5(this.sketch, this.myRef.current)
    }
  

    render() {
      return (
        <div ref={this.myRef}></div>
      )
    }
  }

export default GraphVis;
