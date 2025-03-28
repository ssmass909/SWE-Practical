import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
}

/**
 * Calculates the length of a chord of a circle.
 * Read the specification comment above it carefully in the problem set description.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  if (angleInDegrees === 60) return radius;
  const rad = (angleInDegrees * Math.PI) / 180;
  return 2 * radius * Math.sin(rad / 2);
}

/**
 * Draws an approximate circle using the turtle.
 * Use your implementation of chordLength.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with (e.g., 360 for a close approximation).
 */
export function drawApproximateCircle(turtle: Turtle, radius: number, numSides: number): void {
  const turnDeg = 360 / numSides;
  const lineLength = radius / numSides;
  for (let i = 0; i < numSides; i++) {
    turtle.turn(turnDeg);
    turtle.forward(lineLength);
  }
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  // TODO: Implement distance
  return 0; // Placeholder
}

/**
 * Finds a path (sequence of turns and moves) for the turtle to visit a list of points in order.
 * You should use your distance method as appropriate.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions (e.g., strings like "forward 10", "turn 90") representing the path.
 *          This is simplified for Problem Set 0 and we won't actually use these instructions to drive the turtle directly in this starter code.
 *          The function primarily needs to *calculate* the path conceptually.
 */
export function findPath(turtle: Turtle, points: Point[]): string[] {
  const result: string[] = [];
  points.forEach((point) => {
    const orientation = turtle.getHeading();
    const dist = distance(point, turtle.getPosition());
    const deltaY = point.y - turtle.getPosition().y;
    const deltaX = point.x - turtle.getPosition().x;
    const angleBetweenPoints = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const turnAngle = orientation - angleBetweenPoints;
    const resultAngle =
      angleBetweenPoints - turnAngle > 0 ? angleBetweenPoints - turnAngle : turnAngle - angleBetweenPoints;
    result.push(`turn ${resultAngle}`);
    result.push(`forward ${dist}`);
  });

  return result;
}

/**
 * Draws your personal art using the turtle.
 * Be creative and implement something interesting!
 * Use at least 20 lines of non-repetitive code.
 * You may use helper methods, loops, etc., and the `color` method of the Turtle.
 * @param turtle The turtle to use.
 */

export function drawPersonalArt(turtle: Turtle): void {
  const size = 100;
  const deg = 180 - 36;
  turtle.forward(size);
  turtle.turn(deg);
  turtle.forward(size);
  turtle.turn(deg);
  turtle.forward(size);
  turtle.turn(deg);
  turtle.forward(size);
  turtle.turn(deg);
  turtle.forward(size);
}

function generateHTML(pathData: { start: Point; end: Point; color: Color }[]): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1; // Adjust scale as needed
  const offsetX = canvasWidth / 2; // Center the origin
  const offsetY = canvasHeight / 2; // Center the origin

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(htmlContent: string, filename: string = "output.html"): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    // For macOS
    execSync(`open ${filename}`);
  } catch {
    try {
      // For Windows
      execSync(`start ${filename}`);
    } catch {
      try {
        // For Linux
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  drawPersonalArt(turtle);
  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath()); // Cast to access getPath
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
