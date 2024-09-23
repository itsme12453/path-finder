// function generateCoordinates(num, max) {
//     let coordinates = [];
//     for (let i = 0; i < num; i++) {
//         let x = Math.random() * max;
//         let y = Math.random() * max;
//         coordinates.push([parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))]);  // Limiting to 2 decimal places
//     }
//     return coordinates;
// }

// const coords = generateCoordinates(30, 4.5);
// console.log(coords);

const coords = [
    [
        3.85,
        0.79
    ],
    [
        2.89,
        1.97
    ],
    [
        1,
        1.84
    ],
    [
        1.82,
        0.93
    ],
    [
        4.03,
        1.69
    ],
    [
        0.55,
        0.5
    ],
    [
        0.82,
        3.6
    ],
    [
        2.83,
        2.68
    ],
    [
        2.48,
        1.46
    ],
    [
        0.47,
        4.47
    ],
    [
        1.16,
        0.2
    ],
    [
        4.2,
        3.17
    ],
    [
        4.38,
        1.93
    ],
    [
        1.52,
        4.04
    ],
    [
        2.65,
        4.43
    ],
    [
        3.38,
        4.24
    ],
    [
        0.57,
        1.18
    ],
    [
        3.14,
        2.77
    ],
    [
        2.12,
        1.63
    ],
    [
        1.85,
        3.11
    ],
    [
        3.92,
        3.2
    ],
    [
        3.81,
        2.02
    ],
    [
        2.81,
        1.13
    ],
    [
        2.18,
        4.08
    ],
    [
        2.83,
        0.91
    ],
    [
        0.5,
        3.48
    ],
    [
        2.94,
        3.16
    ],
    [
        0.87,
        2.68
    ],
    [
        1.46,
        0.17
    ],
    [
        1.59,
        3.78
    ]
]

const startPos = 0;
const endPos = 5;
let current = startPos;

let points = [];
let lines = [];

let connections = {}; // Number of adjacent points
let adjacents = {}; // The index of adjacent points

class Point {
    constructor(pos) {
        this.pos = pos;

        this.draw = function (color = "orange") {
            game.ctx.beginPath();
            game.ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
            game.ctx.fillStyle = color;
            game.ctx.fill();
        };
    }
}

class Line {
    constructor(p1, p2, color = "black", lineWidth = 1) {
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.lineWidth = lineWidth;

        this.draw = function () {
            game.ctx.beginPath();
            game.ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
            game.ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
            game.ctx.strokeStyle = this.color;
            game.ctx.lineWidth = this.lineWidth;
            game.ctx.stroke();
        };
    }
}

function removeDuplicatesFromDictionary(adjacent) {
    const cleanedDictionary = {};

    Object.keys(adjacent).forEach((key) => {
        const array = adjacent[key];
        const uniqueArray = Array.from(new Set(array));

        cleanedDictionary[key] = uniqueArray;
    });

    return cleanedDictionary;
}

let game = {
    start: function () {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.height = 600;
        this.canvas.width = 600;

        // Create points from coords
        for (let i = 0; i < coords.length; i++) {
            points.push(
                new Point(
                    new Vector2D(
                        coords[i][0] * 100 + 100,
                        this.canvas.height - (coords[i][1] * 100 + 100)
                    )
                )
            );
        }

        // Create lines and adjacencies
        for (let i = 0; i < coords.length; i++) {
            for (let j = 0; j < coords.length; j++) {
                if (i !== j) {
                    if (
                        (Math.abs(coords[i][0] - coords[j][0]) <= 1 &&
                            Math.abs(coords[i][1] - coords[j][1]) <= 1)
                    ) {
                        lines.push(new Line(points[i], points[j]));

                        if (i in connections) {
                            connections[i] += 1;

                            if (i in adjacents) {
                                adjacents[i].push(points[j]);
                            } else {
                                adjacents[i] = [points[j]];
                            }
                        } else {
                            connections[i] = 1;

                            if (i in adjacents) {
                                adjacents[i].push(points[j]);
                            } else {
                                adjacents[i] = [points[j]];
                            }
                        }

                        if (j in connections) {
                            connections[j] += 1;

                            if (j in adjacents) {
                                adjacents[j].push(points[i]);
                            } else {
                                adjacents[j] = [points[i]];
                            }
                        } else {
                            connections[j] = 1;

                            if (j in adjacents) {
                                adjacents[j].push(points[i]);
                            } else {
                                adjacents[j] = [points[i]];
                            }
                        }
                    }
                }
            }
        }

        adjacents = removeDuplicatesFromDictionary(adjacents);

        // BFS Algorithm to find the shortest path
        function bfs(start, end, callback) {
            let queue = [start];
            let visited = {};
            let previous = {};

            visited[start] = true;
            previous[start] = null;

            function processNode(node) {
                const colors = ["red", "orange", "yellow", "lightblue", "purple", "green"];
                let color = colors[Math.floor(Math.random() * colors.length)]

                points[node].draw(color);

                if (node === end) {
                    let path = [];
                    while (node !== null) {
                        path.push(node);
                        node = previous[node];
                    }
                    return path.reverse();
                }

                (adjacents[node] || []).forEach((neighbor) => {
                    let neighborIndex = points.indexOf(neighbor);

                    if (!(neighborIndex in visited)) {
                        visited[neighborIndex] = true;
                        previous[neighborIndex] = node;
                        queue.push(neighborIndex);

                        // Draw the line that BFS is traversing
                        let line = new Line(points[node], neighbor, color, 2);
                        lines.push(line);
                        line.draw();
                    }
                });
                return null;
            }

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
            }, 300); // 500ms delay between steps for visual effect
        }

        bfs(startPos, endPos, (path) => {
            if (path.length === 0) {
                console.log("No path found");
            } else {
                console.log("Path found:", path);

                // Draw the shortest path in blue
                for (let i = 0; i < path.length - 1; i++) {
                    let p1 = points[path[i]];
                    let p2 = points[path[i + 1]];
                    let line = new Line(p1, p2, "blue", 3);
                    lines.push(line);
                }
            }
        });

        let odd = 0;
        let even = 0;

        for (let key in connections) {
            connections[key] /= 2;

            if (connections[key] % 2 == 0) {
                even += 1;
            } else {
                odd += 1;
            }
        }

        if (odd > 2 || odd == 1) {
            console.log("IMPOSSIBLE");
        } else {
            console.log("POSSIBLE");
        }
    },
    stop: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

function animate() {
    window.requestAnimationFrame(animate);

    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    for (let l = 0; l < lines.length; l++) {
        lines[l].draw();
    }

    for (let p = 0; p < points.length; p++) {
        points[p].draw();

        game.ctx.font = "16px Arial";
        game.ctx.fillText(
            `${connections[p] !== undefined ? connections[p] : 0}`,
            points[p].pos.x + 5,
            points[p].pos.y + 15
        );
    }
}

game.start();
animate();
