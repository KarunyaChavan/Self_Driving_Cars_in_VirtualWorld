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
    }

    draw(ctx){
        for(const env of this.envelopes){
            env.draw(ctx);
        }
    }
}