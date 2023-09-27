'use client'

import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function Home() {
  const [radius, setRadius] = useState(1);
  const diameter = radius * 2;
  const circumference = Math.round(((diameter * Math.PI) + Number.EPSILON) * 1000) / 1000

  const area = Math.round((Math.PI * Math.pow(radius, 2) + Number.EPSILON) * 1000) / 1000;
  const svgWidth = 600;
  const svgHeight = 600;

  useEffect(() => {
    // Select the SVG element
    const svg = d3.select('#circles-svg');
    
    // Clear previous elements
    svg.selectAll("*").remove();
    
    // Calculate scaled radius
    const scaledRadius = Math.min(svgWidth, svgHeight) / 2 * (radius / 25);
    
    // Compute the color of the circle
    // We want to go around the color scale twice with a small offset for flavor!
    const fillValue = Math.round((radius / 25) * 720) + 5;
    const fill = `hsl(${fillValue}, 100%, 50%)`
    console.log(fillValue);
    
    // Add a circle
    svg.append('circle')
      .attr('cx', svgWidth / 2)
      .attr('cy', svgHeight / 2)
      .attr('r', scaledRadius)
      .attr('fill', fill);
    
    // Add radius line
    svg.append('line')
      .attr('x1', svgWidth / 2)
      .attr('y1', svgHeight / 2)
      .attr('x2', svgWidth / 2)
      .attr('y2', (svgHeight / 2) - scaledRadius)
      .attr('stroke', (fillValue % 360 > 210)  ? 'white' : 'black') // change this based on your actual fill logic
      .attr('stroke-width', 3);
    
    // Add radius label
    svg.append('text')
      .attr('x', svgWidth / 2 + 10)  // 10 pixels right of the line end
      .attr('y', (svgHeight / 2) - scaledRadius - 4) // align with the line end and offset
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .text(`${radius}`);
  }, [radius]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className='font-mono text-2xl text-center'>This is for Raphi, Bleep Bloop</h1>
      </div>
    <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      <div className='min-w-[500px]'>
        <svg id="circles-svg" width={svgWidth} height={svgHeight}></svg>
      </div>
      <div>
        <div className="font-mono text-sm"><em>Radius:</em> {radius}</div>
        <div className="font-mono text-sm"><em>Diameter:</em> {diameter}</div>
        <div className="font-mono text-sm"><em>Circumference:</em> {circumference}</div>
        <div className="font-mono text-sm"><em>Area:</em> {area}</div>
      </div>
    </div>
    <div className="w-36 items-center gap-2 justify-between font-mono text-sm lg:flex">
      <label htmlFor="radius">Set The Radius!</label>
      <input type="range" min="1" max="25" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
    </div>
  </main>
  )
}