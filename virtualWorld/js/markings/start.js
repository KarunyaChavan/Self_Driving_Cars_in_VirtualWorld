class Start extends Marking{
    constructor(center, directionVector, width, height){
        super(center, directionVector, width, height);

        this.img = new Image();
        const imgPath = "virtualWorld/assets/car.png";
        this.img.src = imgPath;
        

        this.type = "start";
    }

    draw(ctx){
        if(!this.ready) return;
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI/2);

        ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);

        ctx.restore();
    }
}