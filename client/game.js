const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

let players = {};
let myX = 100, myY = 100;
let myVelY = 0;       
let onGround = false;   
let keys = {};
let facing = 'left';

let bullets = [];
const BULLET_SPEED = 6;

const GRAVITY = 0.5;    
const JUMP_FORCE = -10;  
const GROUND_Y = 350;

let groundTexture = null;
const groundImage = new Image();
groundImage.src = "https://tse4.mm.bing.net/th/id/OIP.vRr8ScD3Zay6XUF9fVafLwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";
groundImage.onload = () => {
  groundTexture = ctx.createPattern(groundImage, "repeat");
};

const playerSprite = new Image();
playerSprite.src = "https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/19470f3427cb196.png";

window.updatePlayers = (data) => {
  players = data;
};

window.startGame = () => {
  document.getElementById("status").innerText = "Jogo iniciado!";
};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
    if (keys["ArrowLeft"]) {
        myX -= 3;
        facing = "left";
    }
    if (keys["ArrowRight"]) {
        myX += 3;
        facing = "right";
    }
    if (keys["ArrowUp"] && onGround) {
        myVelY = JUMP_FORCE;
        onGround = false;
    }

    if (keys["x"] || keys["X"]) {
        shootBullet();
        keys["x"] = false;
        keys["X"] = false;
    }

    myVelY += GRAVITY;
    myY += myVelY;

    if (myY + 30 >= GROUND_Y) {
        myY = GROUND_Y - 30;
        myVelY = 0;
        onGround = true;
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].dir === "right" ? BULLET_SPEED : -BULLET_SPEED;
        if (bullets[i].x < 0 || bullets[i].x > canvas.width) bullets.splice(i, 1);
    }


    enviarMovimento(myX, myY);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = groundTexture || "#444";
    ctx.fillRect(0, GROUND_Y, canvas.width, 50);
  
    for (const [id, p] of Object.entries(players)) {
        const isMe = id === socket.id;
        const direction = isMe ? facing : "left";

        if (playerSprite.complete && playerSprite.naturalWidth > 0) {
            ctx.save();
            ctx.translate(p.x + 16, p.y + 16); 
            if (direction === "right") ctx.scale(-1, 1); 
            ctx.drawImage(playerSprite, -16, -16, 32, 32);
            ctx.restore();
        } else {
            ctx.fillStyle = isMe ? "lime" : "red";
            ctx.fillRect(p.x, p.y, 30, 30);
        }
    }

    if (Object.keys(players).length === 0) {
        ctx.save();
        ctx.translate(myX + 16, myY + 16);
        if (facing === "right") ctx.scale(-1, 1);
        if (playerSprite.complete && playerSprite.naturalWidth > 0) {
            ctx.drawImage(playerSprite, -16, -16, 32, 32);
        } else {
            ctx.fillStyle = "lime";
            ctx.fillRect(-15, -15, 30, 30);
        }
        ctx.restore();
    }

    ctx.fillStyle = "yellow";
    for (const b of bullets) {
        ctx.fillRect(b.x - 4, b.y - 2, 8, 4); // retângulo simples como bala
    }
}

function shootBullet() {
    bullets.push({
        x: myX + 16, 
        y: myY + 16,
        dir: facing
    });
}
  

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
