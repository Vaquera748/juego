const pintura = document.getElementById('pintura');
const ctx = pintura.getContext('2d');
let objetos = [
    {nombre:'piedra',x:50,y:0,width:10,color:'#aa9900',velocidad:0.5, vida: 3},
    {nombre:'piedra2',x:80,y:0,width:10,color:'#BB1100',velocidad:0.5, vida: 3},
    {nombre:'piedra3',x:20,y:60,width:10,color:'#aa99CC',velocidad:0.5, vida: 3},
    {nombre:'piedra4',x:350,y:0,width:10,color:'#025',velocidad:0.5, vida: 3},
];

const minRad = 10;
const rangeRad = 20;
let p = 0;
let x = 0, y = 0;
let mouseRadioCrece = true;
let finJuego = false;
let puntaje = 0;
let disparos = [];

function distancia(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function colision(objeto1, objeto2) {
    const distanciaEntreObjetos = distancia(objeto1.x, objeto1.y, objeto2.x, objeto2.y);
    return distanciaEntreObjetos <= (objeto1.width + objeto2.width);
}

function crearCirculo() {
    const nuevoCirculo = {
        nombre: `piedra${objetos.length + 1}`,
        x: Math.random() * pintura.width,
        y: 0,
        width: 10,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        velocidad: Math.random() * 2 + 0.1,
        vida: 3
    };
    objetos.push(nuevoCirculo);
}

function animate() {
    if (mouseRadioCrece) {
        p = p + 0.01;
        if (p > 1) {
            mouseRadioCrece = false;
        }
    } else {
        p = p - 0.01;
        if (p < 0.1) {
            mouseRadioCrece = true;
        }
    }
    const rad = minRad + rangeRad * p;

    ctx.clearRect(0, 0, pintura.width, pintura.height);

    //disparos
    disparos.forEach((disparo, index) => {
        ctx.beginPath();
        ctx.arc(disparo.x, disparo.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.stroke();
        disparo.y -= 5;


        if (disparo.y < 0) {
            disparos.splice(index, 1);
        }
    });

    objetos.forEach((objeto, index) => {
        ctx.beginPath();
        ctx.arc(objeto.x, objeto.y, objeto.width, 0, Math.PI * 2);
        ctx.fillStyle = objeto.color;
        ctx.fill();
        ctx.stroke();
        ctx.font = "10px Arial";
        const a = ctx.measureText(objeto.nombre);
        ctx.fillText(objeto.nombre, objeto.x - a.width / 2, objeto.y + 20);
        ctx.fillText(`Vida: ${objeto.vida}`, objeto.x - a.width / 2, objeto.y + 35);

        if (colision({x: x, y: y, width: rad}, objeto)) {
            alert('Nooo !!! GAME OVER');
            finJuego = true;
        }


        disparos.forEach((disparo, disparoIndex) => {
            if (colision({x: disparo.x, y: disparo.y, width: 5}, objeto)) {
                objeto.vida -= 1;
                disparos.splice(disparoIndex, 1);
                puntaje += 10;
                if (objeto.vida <= 0) {
                    objetos.splice(index, 1);
                    crearCirculo();
                }
            }
        });

        objeto.y += objeto.velocidad;
        if (objeto.y > pintura.height) {
            objeto.y = 0;
            objeto.velocidad *= 1.2;
            objeto.x = (Math.random() * pintura.width);
        }
    });

    //triángulo 
    ctx.beginPath();
    ctx.moveTo(x, y - rad);
    ctx.lineTo(x - rad, y + rad);
    ctx.lineTo(x + rad, y + rad);
    ctx.closePath();
    ctx.fillStyle = '#1288AA';
    ctx.fill();
    ctx.stroke();

    //puntaje
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Puntaje: " + puntaje, 10, 20);

    ctx.beginPath();
    ctx.rect(1, 1, pintura.width - 1, pintura.height - 1);
    ctx.stroke();

    if (!finJuego) {
        requestAnimationFrame(animate);
    }
}

animate();

pintura.addEventListener('mousemove', (info) => {
    x = info.offsetX;
    y = info.offsetY;
});

pintura.addEventListener('click', () => {
    disparos.push({x: x, y: y});
});





