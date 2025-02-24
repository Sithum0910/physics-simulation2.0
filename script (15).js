let planets = [];
let star;

function setup() {
  createCanvas(800, 600);
  star = { x: width / 2, y: height / 2, mass: 500 };

  for (let i = 0; i < 5; i++) {
    planets.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      mass: random(10, 30)
    });
  }
}

function draw() {
  background(0);

  // Draw star
  fill(255, 200, 0);
  ellipse(star.x, star.y, 20, 20);

  // Update and draw planets
  for (let planet of planets) {
    // Calculate gravitational force
    let dx = star.x - planet.x;
    let dy = star.y - planet.y;
    let distance = sqrt(dx * dx + dy * dy);
    let force = (star.mass * planet.mass) / (distance * distance);

    // Apply force
    planet.vx += (force * dx / distance) * 0.01;
    planet.vy += (force * dy / distance) * 0.01;

    // Update position
    planet.x += planet.vx;
    planet.y += planet.vy;

    // Draw planet
    fill(100, 150, 255);
    ellipse(planet.x, planet.y, planet.mass, planet.mass);
  }
}