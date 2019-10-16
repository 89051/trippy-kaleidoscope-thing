let w = 0, h = 0;
const image = new Image();
const opp = 240, adj = 416, hyp = 480;

const triangleCanvas = new OffscreenCanvas(opp, adj); //creates another canvas that can be drawn
//as if it were an image onto the main canvas
const hexagonCanvas = new OffscreenCanvas(2*hyp, 2*adj);

let lastTimestamp = 0;
let angle = 0;

let n = 0;

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('Kanvas');
    canvas.width = w;
    canvas.height = h;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    image.src = "trippy.jpg";
    image.onload = () => window.requestAnimationFrame(redraw);

    const canvas = document.getElementById('Kanvas');
    const context = canvas.getContext('2d');

    canvas.addEventListener('click', event => {
      n++;
    }, false);

    canvas.addEventListener('contextmenu', event => {
      n--;
      event.preventDefault();
    }, false);




}

function redraw(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    angle += frameLength/2;

    renderTriangle();
    renderHexagon();
    renderKaleidoscope();

    const canvas = document.getElementById('Kanvas');
    const context = canvas.getContext('2d');

    context.drawImage(Kanvas, 0, 0);

    window.requestAnimationFrame(redraw);

}

function renderTriangle() {

    const context = triangleCanvas.getContext('2d');

    context.clearRect(0,0,opp,adj);

    context.fillStyle = 'white';
    context.globalCompositeOperation="source-over"; //new things draw over old things

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, adj);
    context.lineTo(opp, adj);
    context.lineTo(0, 0);
    context.fill(); //draw triangle

    context.globalCompositeOperation="source-in"; //only draw where already been drawn

    context.save(); //rotates default to top left corner
    context.translate(opp/2, adj/2) // move so top left corner is in centre
    context.rotate(angle); //rotate
    context.drawImage(image, -image.width/2, -image.height/2); //put image back to position
    context.restore();

}

function renderHexagon() {

    const context = hexagonCanvas.getContext('2d');
    context.clearRect(0, 0, 2*hyp, 2*adj);
    context.save(); //save canvas state to be restored later

    context.translate(hyp,adj); //get to centre point

    for (let j = 0; j < n; j ++) {

        context.drawImage(triangleCanvas,0,0); //draws a triangle copy

        context.scale(-1,1); //sets next one to be a mirror image (flip over adj side)
        context.drawImage(triangleCanvas,0,0); //draw it
        context.scale(-1,1); //flip next one to alternate them

        context.rotate((2*Math.PI/n)); //rotate 60 degrees

    }

    context.restore();

}

function renderKaleidoscope() {

    const canvas = document.getElementById('Kanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'black'; //background made black, so when transparent is made dark
    context.fillRect(0,0,w,h);



    context.save();
    context.translate(w/2-hyp, h/2-adj);

    context.globalAlpha = 1; //transparency of the image
    context.drawImage(hexagonCanvas, 0,0);

    context.globalAlpha = 0.5; //half transparent
    for (let i = 0; i < 6; i++) {
        context.drawImage(hexagonCanvas, 2*adj*Math.sin(i*Math.PI/3),2*adj*Math.cos(i*Math.PI/3));
    } //draw 6 hexagons spread out at angles of 60 at 2*adj from the startpoint

    context.restore();

    context.fillStyle = '#ff3dcb';
      context.strokeStyle = '#ff3dcb';
    context.font = "15px Consolas";
    context.fillText("left click: add triangle", 10, 40);
    context.strokeText("left click: add triangle", 10, 40)
    context.fillText("right click: remove triangle", 10, 80);
    context.strokeText("right click: remove triangle", 10, 80)

}
