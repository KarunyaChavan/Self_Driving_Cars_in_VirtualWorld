class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    draw(ctx, size = 18, color = "black"){
        const rad = size/2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2); //drawing whole circle from 0 rad to 2PI rad
        ctx.fill();
    }
}