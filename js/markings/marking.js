class Marking {
    constructor(center, directionVector, width, height){
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment( //segment of length of marking
            translate(center, angle(directionVector), height/2),
            translate(center, angle(directionVector), -height/2)
        );

        this.poly = new Envelope(this.support, width, 0).poly; //created envelope around the above detected segment
        //Drawing borders around the marking
    }

    draw(ctx){
        this.poly.draw(ctx, { width: 5, color: "white"});
    }
}