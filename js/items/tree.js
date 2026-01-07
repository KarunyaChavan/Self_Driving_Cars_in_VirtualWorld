class Tree{
    constructor(center, size, heightCoef = 0.3){
        this.center = center;
        this.size = size; //size of the base
        this.heightCoef = heightCoef;
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
            point.draw(ctx, {size, color})
        }
        // new Segment(this.center, top).draw(ctx); //added to identify the tree's vertical structure
    }
}