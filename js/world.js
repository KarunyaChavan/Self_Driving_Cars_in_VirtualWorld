class World{
    constructor(graph, 
        roadWidth = 100, 
        roundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160
    ){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];
        this.laneGuides = [];

        this.markings = [];

        this.frameCount = 0;

        this.generate();
    }

    static load(info){
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph); //step 1: first loading graph foundation
        //step 2: Loading attributes
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;
        world.buildingWidth = info.buildingWidth;
        world.buildingMinLength = info.buildingMinLength;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;
        //step 3: Loading structures - envelopes
        world.envelopes = info.envelopes.map((e) => Envelope.load(e));
        //step 4: Loading road borders
        world.roadBorders = info.roadBorders.map((b) => new Segment(b.p1, b.p2));
        //step 5: Loading buildings
        world.buildings = info.buildings.map((b) => Building.load(b));
        //step 6: Loading trees (avoided random spawing of trees)
        world.trees = info.trees.map((t) => new Tree(t.center, info.treeSize));
        //step 7: Loading lane guides
        world.laneGuides = info.laneGuides.map((g) => new Segment(g.p1, g.p2));
        //step 8: Loading Markings (Ensured all markings have their type property)
        world.markings = info.markings.map((m) => Marking.load(m));
        //step 9: Preserving the viewport state (zoom and offset)
        world.zoom = info.zoom;
        world.offset = info.offset;

        return world;
    }

    generate(){
        this.envelopes.length = 0;
        for(const seg of this.graph.segments){
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }
        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides(){
        const tmpEnvelopes = [];
        for(const seg of this.graph.segments){
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth/2,
                    this.roadRoundness
                )
            );
        }
        const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
        return segments;
    }

    #generateTrees(){
        const points = [
            ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
            ...this.buildings.map((b) => b.base.points).flat()
        ];

        if(points.length === 0) return [];

        const left = Math.min(...points.map((p) => p.x));
        const right = Math.max(...points.map((p) => p.x));
        const top = Math.min(...points.map((p) => p.y));
        const bottom = Math.max(...points.map((p) => p.y));

        const illegalPolys = [
            ...this.buildings.map((b) => b.base),
            ...this.envelopes.map((e) => e.poly)
        ];

        let tryCount = 0;
        const trees = [];
        while(tryCount < 100){
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(top, bottom, Math.random())
            );
            
            //checks whether trees are close to buildings
            let keep = true;
            for(const poly of illegalPolys){
                if(poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize/2){
                    keep = false;
                    break;
                }
            }
            
            //avoiding trees intersection with each other
            if(keep){
                for(const tree of trees){
                    if(distance(tree.center, p) < this.treeSize){
                        keep = false;
                        break;
                    }
                }
            }

            //avoiding trees in middle of nowhere
            if(keep){
                let closeToSomething = false;
                for(const poly of illegalPolys){
                    if(poly.distanceToPoint(p) < this.treeSize*2){
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if(keep){
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for(const seg of this.graph.segments){
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness
                )
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly)); //building will be constructed on top of guides
        for(let i=0;i < guides.length; i++){
            const seg = guides[i];
            if(seg.length() < this.buildingMinLength){
                guides.splice(i, 1); //ensuring only appropriate foundation for buildings
                i--;
            }
        }

        const supports = [];
        for(let seg of guides){
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(len / (this.buildingMinLength + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;

            const dir = seg.directionVector();

            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for(let i = 2; i <= buildingCount; i++){
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for(const seg of supports){
            bases.push(new Envelope(seg, this.buildingWidth).poly)
        }

        //Removing intersecting polygons
        const eps = 0.001;
        for(let i=0; i < bases.length; i++){
            for(let j=i+1; j < bases.length; j++){
                if(bases[i].intersectsPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps){
                    bases.splice(j , 1);
                    j--;
                }
            }
        }

        return bases.map((b) => new Building(b));
    }

    #getIntersections() {
      const subset = [];
      for (const point of this.graph.points) {
         let degree = 0;
         for (const seg of this.graph.segments) {
            if (seg.includes(point)) {
               degree++;
            }
         }

         if (degree > 2) {
            subset.push(point);
         }
      }
      return subset;
   }

    #updateLights() {
      const lights = this.markings.filter((m) => m instanceof Light);
      const controlCenters = [];
      for (const light of lights) {
         const point = getNearestPoint(light.center, this.#getIntersections());
         let controlCenter = controlCenters.find((c) => c.equals(point));
         if (!controlCenter) {
            controlCenter = new Point(point.x, point.y);
            controlCenter.lights = [light];
            controlCenters.push(controlCenter);
         } else {
            controlCenter.lights.push(light);
         }
      }
      const greenDuration = 2,
         yellowDuration = 1;
      for (const center of controlCenters) {
         center.ticks = center.lights.length * (greenDuration + yellowDuration);
      }
      const tick = Math.floor(this.frameCount / 60);
      for (const center of controlCenters) {
         const cTick = tick % center.ticks;
         const greenYellowIndex = Math.floor(
            cTick / (greenDuration + yellowDuration)
         );
         const greenYellowState =
            cTick % (greenDuration + yellowDuration) < greenDuration
               ? "green"
               : "yellow";
         for (let i = 0; i < center.lights.length; i++) {
            if (i == greenYellowIndex) {
               center.lights[i].state = greenYellowState;
            } else {
               center.lights[i].state = "red";
            }
         }
      }
      this.frameCount++;
   }

    draw(ctx, viewPoint){
        this.#updateLights();

        for(const env of this.envelopes){
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }
        
        for(const marking of this.markings){
            marking.draw(ctx);
        }

        for(const seg of this.graph.segments){
            seg.draw(ctx, {color: "white", width: 3, dash: [10, 10]});
        }

        for(const seg of this.roadBorders){
            seg.draw(ctx, {color: "white", width: 4});
        }
        
        //avoiding overlapping of 3d structures by groupping and sorting them while drawing
        const items = [...this.buildings, ...this.trees];
        items.sort(
            (a,b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
        );
        for(const item of items){
            item.draw(ctx, viewPoint);
        }

        //Detecting the markings width along the road
        // for(const seg of this.laneGuides){
        //     seg.draw(ctx, {color: "red"});
        // }
    }
}