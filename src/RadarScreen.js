import Theatre from '../easel/Theatre.js';
import Texture from '../easel/Texture.js';

let vignette = new Image();
vignette.src = "./art/environment/computerscene_screenoverlay_vignette.png";

let cursor = new Image();
cursor.src = './art/ui/cursor.png';

export default class RadarScreen {

    constructor(canvas, ships, mouse, abilityVisual, gridWidth = 15, gridHeight = 11, tileSizePixels = 50) {

        this.canvas = canvas
        this.ctx = canvas.getContext("2d");
        this.ships = ships;
        this.mouse = mouse;
        this.abilityVisual = abilityVisual;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.tileSizePixels = tileSizePixels;
    }

    render() {
        this.clearCanvas();

        // Follow Player
        this.ctx.save();
        let player = this.ships[0];
        this.ctx.translate(this.canvas.width/2, this.canvas.height / 2);
        this.ctx.translate(-player.x, -player.y);
        

        this.renderGrid();
        this.lineToMouse();
        this.renderShips();
        this.renderAbilityVisual();
        this.renderText();
        this.renderGridLabels();
        this.ctx.drawImage(vignette, player.x - this.canvas.width/2, player.y - this.canvas.height / 2);

        

        

        this.ctx.restore();
        

    
    }

    clearCanvas() {

        // const startX = -this.canvas.width / 2;
        // const startY = -this.canvas.height / 2;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGrid() {

        let ctx = this.ctx;
        ctx.strokeStyle = "rgb(40,70,70)";
        ctx.beginPath();

        // vertical lines
        for (let i = 0; i < this.tileSizePixels * (this.gridHeight + 1); i += this.tileSizePixels) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.gridWidth * this.tileSizePixels, i);
            ctx.stroke();
        }

        //horizontal lines
        for (let i = 0; i < this.tileSizePixels * (this.gridWidth + 1); i += this.tileSizePixels) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.gridHeight * this.tileSizePixels);
            ctx.stroke();
        }

    }

    renderGridLabels() {

        let ctx = this.ctx;
        this.ctx.font = "bold 12px Consolas";
        ctx.fillStyle = "rgb(140,170,170)";

        // label rows
        for (let i = 0; i < this.tileSizePixels * (this.gridHeight); i += this.tileSizePixels) {

            let string = i / this.tileSizePixels;
            let x = this.ships[0].x - this.canvas.width / 2;
            let y = i - this.tileSizePixels/2 + this.tileSizePixels;
            
            ctx.fillText(string, x + 15, y + 3);
        }

        // label columns
        for (let i = 0; i < this.tileSizePixels * (this.gridWidth); i += this.tileSizePixels) {

            let string = i / this.tileSizePixels;
            let x = i + this.tileSizePixels / 2;
            let y = this.ships[0].y - this.canvas.height / 2;
            
            ctx.fillText(string, x - 3, y + 25);
        }

    }

    lineToMouse() {

        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo(this.ships[0].x, this.ships[0].y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);

        this.ctx.stroke();
    }

    renderShips() {

        for (let ship of this.ships) {
            
            this.ctx.fillStyle = ship.color;
            this.ctx.beginPath();
            this.ctx.arc(ship.x, ship.y, ship.dotRadius, 0, Math.PI * 2);
            this.ctx.fill();

            ship.color == "rgba(0, 0, 200, 0.8)" && this.ctx.fillText("bouy", ship.x - 15, ship.y + 15);
        }
    }
    
    renderAbilityVisual() {
        const visual = this.abilityVisual;
        const ctx = this.ctx;

        if (visual.type == 'distance') {
            ctx.strokeStyle = "rgba(200, 0, 0, 0.4)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            this.ctx.arc(visual.x, visual.y, visual.r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if (visual.type == 'radius') {

            ctx.fillStyle = "rgba(200, 0, 0, 0.4)";

            if (visual.subInsideRadius) { 
                ctx.beginPath();
                ctx.arc(visual.x, visual.y, visual.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.save();
                ctx.beginPath();
                ctx.rect( 0, 0, this.gridWidth * this.tileSizePixels, this.gridHeight * this.tileSizePixels);
                ctx.clip();
                ctx.arc(visual.x, visual.y, visual.r, 0, Math.PI * 2);
                ctx.fill("evenodd");
                ctx.restore();
            }
        }

        if (visual.type == 'west') {
            ctx.fillStyle = "rgba(200, 0, 0, 0.4)";
            ctx.fillRect(0, 0, visual.x, this.gridHeight * this.tileSizePixels);
        }
        if (visual.type == 'east') {
            ctx.fillStyle = "rgba(200, 0, 0, 0.4)";
            ctx.fillRect(visual.x, 0, this.gridWidth * this.tileSizePixels, this.gridHeight * this.tileSizePixels);
        }
        if (visual.type == 'north') {
            ctx.fillStyle = "rgba(200, 0, 0, 0.4)";
            ctx.fillRect(0, 0, this.gridWidth * this.tileSizePixels, visual.y);
        }
        if (visual.type == 'south') {
            ctx.fillStyle = "rgba(200, 0, 0, 0.4)";
            ctx.fillRect(0, visual.y, this.gridWidth * this.tileSizePixels, this.gridHeight * this.tileSizePixels - visual.y);
        }

        // !!! todo: bouy ability
        // !!! todo: hot / cold
    }

    renderText() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 24px Consolas";
        const visual = this.abilityVisual;
        let player = this.ships[0];
        this.ctx.fillText(visual.text, player.x - 180, player.y - 110);
    }

}