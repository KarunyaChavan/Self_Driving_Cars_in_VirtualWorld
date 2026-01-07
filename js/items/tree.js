class Tree{
    constructor(center, size, heightCoef = 0.3){
        this.center = center;
        this.size = size; //size of the base
        this.heightCoef = heightCoef;
        this.base = this.#generateLevel(center, size);
    }

    #generateLevel(point, size){
        const points = [];
        const rad = size/2;
        for(let a=0; a < Math.PI * 2; a += Math.PI/16){
            const soCalledRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
            const noisyRadius = rad * lerp(0.5, 1, soCalledRandom);
            points.push(translate(point, a, noisyRadius));
        }
        return new Polygon(points);
    }

    draw(ctx, viewPoint){
        const diff = subtract(this.center, viewPoint);

        // this.center.draw(ctx, {size: this.size, color: "green"}); //already implemented at level 0 in the loop below

        const top = add(this.center, scale(diff, this.heightCoef));

        const levelCount = 7;
        for(let level=0; level < levelCount; level++){
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = "rgb(30," + lerp(50, 200, t) + ",70)"; //gradient shading to trees
            const size = lerp(this.size, 40, t);
            // point.draw(ctx, {size, color}) //used for abstract desgin, but decided to added some noise
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill: color, stroke: "rgba(0,0,0,0)"});
        }
        // new Segment(this.center, top).draw(ctx); //added to identify the tree's vertical structure
    }
}