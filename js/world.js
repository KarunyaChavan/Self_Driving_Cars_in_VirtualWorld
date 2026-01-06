class World{
    constructor(graph, roadWidth = 100, roundness = 3){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roundness;

        this.envelopes = [];

        this.generate();
    }

    generate(){
        this.envelopes.length = 0;
        for(const seg of this.graph.segments){
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }
        // Avoiding segments' intersections
        // Safeguard when there are fewer than 2 envelopes (e.g., after dispose)
        // this.intersections = [];
        // if(this.envelopes.length >= 2){
        //     this.intersections = Polygon.break(
        //         this.envelopes[0].poly,
        //         this.envelopes[1].poly
        //     );
        // }

        Polygon.multiBreak(this.envelopes.map((e) => e.poly));
    }

    draw(ctx){
        for(const env of this.envelopes){
            env.draw(ctx);
        }
        // for(const int of this.intersections){ //to mark intersection pts
        //     int.draw(ctx, {color: "red", size: 6}); 
        // }
    }
}