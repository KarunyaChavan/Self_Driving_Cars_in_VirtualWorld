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

        this.type = "marking"; //no needed, but ensures consistency
    }

    static load(info){
        const point = new Point(info.center.x, info.center.y);
        const dir = new Point(info.directionVector.x, info.directionVector.y);
        switch(info.type){
            case "zebra":
                return new Zebra(point, dir, info.width, info.height);
            case "stop":
                return new Stop(point, dir, info.width, info.height);
            case "start":
                return new Start(point, dir, info.width, info.height);
            case "light":
                return new Light(point, dir, info.width, info.height);
            case "parking":
                return new Parking(point, dir, info.width, info.height);
            case "marking":
                return new Marking(point, dir, info.width, info.height);
            case "target":
                return new Target(point, dir, info.width, info.height);
            case "yield":
                return new Yield(point, dir, info.width, info.height);
        }    
    }

    draw(ctx){
        this.poly.draw(ctx, { width: 5, color: "white"});
    }
}