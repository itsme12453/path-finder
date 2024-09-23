# Graph Traversal Visualization

This project is a visual representation of a graph traversal algorithm using the Breadth-First Search (BFS) method. It allows users to see how the algorithm navigates through a randomly generated set of points and their connections, ultimately determining the shortest path between two points while also exploring graph theory concepts.

## Features

- Visual representation of points and connections.
- Interactive drawing of the BFS process with color-coded lines.
- Calculation and visualization of the shortest path in the graph.
- Graph theory application to determine the possibility of traversing each edge exactly once (Eulerian path).

## Technologies Used

- HTML5 Canvas for rendering graphics.
- JavaScript for implementing the BFS algorithm and managing the graphical interface.

## Code Overview

### Key Components

- **Point Class**: Represents each vertex in the graph.
- **Line Class**: Represents the edges connecting the vertices.
- **BFS Algorithm**: Implements the Breadth-First Search to find the shortest path.

### Example Code Snippets

#### Point and Line Classes

```javascript
class Point {
    constructor(pos) {
        this.pos = pos;
    }

    draw(color = "orange") {
        game.ctx.beginPath();
        game.ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
        game.ctx.fillStyle = color;
        game.ctx.fill();
    }
}

class Line {
    constructor(p1, p2, color = "black", lineWidth = 1) {
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    draw() {
        game.ctx.beginPath();
        game.ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        game.ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        game.ctx.strokeStyle = this.color;
        game.ctx.lineWidth = this.lineWidth;
        game.ctx.stroke();
    }
}
```

#### BFS Implementation

```javascript
function bfs(start, end, callback) {
    let queue = [start];
    let visited = {};
    let previous = {};

    visited[start] = true;
    previous[start] = null;

    // Process nodes
    function processNode(node) {
        points[node].draw("yellow");
        if (node === end) {
            let path = [];
            while (node !== null) {
                path.push(node);
                node = previous[node];
            }
            return path.reverse();
        }
        
        // Explore neighbors
        (adjacents[node] || []).forEach((neighbor) => {
            let neighborIndex = points.indexOf(neighbor);
            if (!(neighborIndex in visited)) {
                visited[neighborIndex] = true;
                previous[neighborIndex] = node;
                queue.push(neighborIndex);
            }
        });
        return null;
    }

    // Visualize BFS
    let bfsStep = setInterval(() => {
        if (queue.length > 0) {
            let node = queue.shift();
            let path = processNode(node);
            if (path) {
                clearInterval(bfsStep);
                callback(path);
            }
        } else {
            clearInterval(bfsStep);
            callback([]);
        }
    }, 300);
}
```

## Graph Theory Application

In this project, we apply fundamental concepts from graph theory to determine whether it is possible to traverse each line (edge) of the graph exactly once, known as the Eulerian path problem. This is a classic problem in graph theory that involves understanding the connectivity of vertices (points) and edges (lines) in a graph.

### Key Concepts

1. **Vertices and Edges**:
   - **Vertices** represent the points in the graph, which are generated randomly and visually represented on the canvas.
   - **Edges** are the lines connecting the vertices, determined by the proximity of the points.

2. **Eulerian Path**:
   - An **Eulerian path** is a trail in a graph that visits every edge exactly once.
   - A connected graph can have an Eulerian path if and only if:
     - It has exactly zero or two vertices of odd degree (number of edges incident to the vertex).
     - All vertices with non-zero degree belong to a single connected component.

### Implementation Details

In the code, we determine whether it's possible to traverse the graph without retracing any edges by analyzing the degree of each vertex. Here’s how it’s implemented:

#### Degree Counting

Each vertex's degree is counted by examining the connections (edges) associated with it. We maintain a `connections` object to track how many edges each vertex has:

```javascript
let connections = {}; // Number of adjacent points

for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords.length; j++) {
        if (i !== j) {
            if (
                (Math.abs(coords[i][0] - coords[j][0]) <= 1 &&
                 Math.abs(coords[i][1] - coords[j][1]) <= 1)
            ) {
                lines.push(new Line(points[i], points[j]));

                connections[i] = (connections[i] || 0) + 1;
                connections[j] = (connections[j] || 0) + 1;
            }
        }
    }
}
```

#### Checking for Eulerian Path Conditions

After counting the degrees, we assess how many vertices have odd degrees. The logic is implemented as follows:

```javascript
let odd = 0;

for (let key in connections) {
    if (connections[key] % 2 === 1) {
        odd += 1;
    }
}

if (odd > 2) {
    console.log("IMPOSSIBLE");
} else {
    console.log("POSSIBLE");
}
```

### Explanation of the Check

1. **Odd Degree Counting**:
   - We iterate through the `connections` object to count how many vertices have an odd number of edges. This is crucial because, according to graph theory, having more than two odd-degree vertices implies that it’s impossible to find an Eulerian path.

2. **Decision Logic**:
   - If there are more than two vertices with an odd degree, the algorithm concludes that it is "IMPOSSIBLE" to traverse all edges without retracing any.
   - If there are zero or two vertices with an odd degree, it’s "POSSIBLE" to traverse the graph according to the rules of Eulerian paths.

## Explanation of the BFS Algorithm

Breadth-First Search (BFS) is a graph traversal algorithm that explores the vertices of a graph in layers. It starts at a given source vertex and explores all its neighbors before moving on to the next layer of vertices. BFS is particularly useful for finding the shortest path in unweighted graphs.

### Steps of the BFS Algorithm

1. **Initialization**:
   - Create a queue to keep track of vertices to be explored.
   - Create a `visited` object to keep track of which vertices have already been explored.
   - Create a `previous` object to reconstruct the path once the target vertex is found.

2. **Processing Nodes**:
   - Dequeue a vertex from the front of the queue.
   - Mark it as visited and draw it on the canvas for visualization.
   - If the dequeued vertex is the target vertex, reconstruct the path using the `previous` object.

3. **Exploring Neighbors**:
   - For each unvisited neighbor of the current vertex, mark it as visited, record its predecessor, and enqueue it.

4. **Repeat**:
   - Continue this process until the queue is empty or the target vertex is found.

### Example BFS Code Snippet

Here's a snippet showing how the BFS algorithm is visualized:

```javascript
function bfs(start, end, callback) {
    let queue = [start];
    let visited = {};
    let previous = {};

    visited[start] = true;
    previous[start] = null;

    // Visualize BFS
    let bfsStep = setInterval(() => {
        if (queue.length > 0) {
            let node = queue.shift();
            let path = processNode(node);
            if (path) {
                clearInterval(bfsStep);
                callback(path);
            }
        } else {
            clearInterval(bfsStep);
            callback([]);
        }
    }, 300);
}
```

### Conclusion

The BFS algorithm not only helps to find the shortest path but also enhances the visualization experience by showing how the algorithm progresses through the graph. It complements the graph theory applications by providing a clear method to traverse the graph and analyze its properties.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
