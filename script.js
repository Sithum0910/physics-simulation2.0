let objects = [];
let trails = [];
let zoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX, dragStartY;

function setup() {
  createCanvas(800, 600);

  // Create initial objects
  objects.push({ x: width / 2, y: height / 2, vx: 0, vy: 0, mass: 1000, radius: 20 });
  objects.push({ x: width / 2 + 200, y: height / 2, vx: 0, vy: 2, mass: 10, radius: 10 });
  objects.push({ x: width / 2 - 200, y: height / 2, vx: 0, vy: -2, mass: 10, radius: 10 });
}

function draw() {
  background(0);

  // Apply pan and zoom
  translate(panX, panY);
  scale(zoom);

  // Draw trails
  for (let trail of trails) {
    stroke(255, 50);
    noFill();
    beginShape();
    for (let point of trail) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  // Update and draw objects
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];

    // Calculate gravitational forces from all other objects
    for (let j = 0; j < objects.length; j++) {
      if (i === j) continue;
      let other = objects[j];

      let dx = other.x - obj.x;
      let dy = other.y - obj.y;
      let distance = sqrt(dx * dx + dy * dy);
      let force = (obj.mass * other.mass) / (distance * distance);

      // Apply force
      obj.vx += (force * dx / distance) * 0.01;
      obj.vy += (force * dy / distance) * 0.01;
    }

    // Update position
    obj.x += obj.vx;
    obj.y += obj.vy;

    // Draw object
    fill(100, 150, 255);
    noStroke();
    ellipse(obj.x, obj.y, obj.radius * 2, obj.radius * 2);

    // Add to trail
    if (frameCount % 10 === 0) {
      if (!trails[i]) trails[i] = [];
      trails[i].push({ x: obj.x, y: obj.y });
      if (trails[i].length > 100) trails[i].shift();
    }

    // Check for collisions
    for (let j = 0; j < objects.length; j++) {
      if (i === j) continue;
      let other = objects[j];
      let dx = other.x - obj.x;
      let dy = other.y - obj.y;
      let distance = sqrt(dx * dx + dy * dy);

      if (distance < obj.radius + other.radius) {
        // Merge objects
        obj.mass += other.mass;
        obj.radius = sqrt(obj.mass);
        objects.splice(j, 1);
        trails.splice(j, 1);
      }
    }
  }
}

function mousePressed() {
  // Create a new object on mouse click
  let newObj = {
    x: (mouseX - panX) / zoom,
    y: (mouseY - panY) / zoom,
    vx: 0,
    vy: 0,
    mass: random(5, 20),
    radius: sqrt(random(5, 20))
  };
  objects.push(newObj);
  trails.push([]);

  // Start panning
  isDragging = true;
  dragStartX = mouseX - panX;
  dragStartY = mouseY - panY;
}

function mouseDragged() {
  if (isDragging) {
    panX = mouseX - dragStartX;
    panY = mouseY - dragStartY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  // Zoom in/out
  zoom += event.delta * -0.01;
  zoom = constrain(zoom, 0.1, 10);
}
