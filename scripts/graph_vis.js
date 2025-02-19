const canvas = document.getElementById("canvas");
const text_adj_mat = document.getElementById("text_adj_mat");
const button_update_adj_mat = document.getElementById("button_update_adj_mat");

const ctx = canvas.getContext("2d");

button_update_adj_mat.addEventListener("click", () => {
    console.log(text_adj_mat.value);
})


ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.fillStyle = "green";
ctx.fillRect(0, 0, 3000, 3000);
ctx.fillStyle = "white";
ctx.fillRect(10, 10, 20, 20);


// window.addEventListener("resize", () => {
//     ctx.canvas.width = window.innerWidth - left_panel.clientWidth - 50;
//     ctx.canvas.height = window.innerHeight;
//     ctx.fillStyle = "green";
//     ctx.fillRect(0, 0, 1500, 1000);
//     ctx.fillStyle = "white";
//     ctx.fillRect(10, 10, 20, 20);
// } )

class name {
    constructor(parameters) {
        
    }
}

let x = 10;
requestAnimationFrame(animate);
function animate() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 3000, 3000);
    ctx.fillStyle = "white";
    ctx.fillRect(x, 10, 20, 20);
    
    x += 1;
    requestAnimationFrame(animate);
    
    
}
