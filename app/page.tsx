'use client'

import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function Home() {
  const [radius, setRadius] = useState(1);
  const diameter = radius * 2;
  const circumference = Math.round(((diameter * Math.PI) + Number.EPSILON) * 1000) / 1000

  const area = Math.round((Math.PI * Math.pow(radius, 2) + Number.EPSILON) * 1000) / 1000;
  const svgWidth = 500;
  const svgHeight = 500;

  useEffect(() => {
    // Select the SVG element
    const svg = d3.select('#circles-svg');

    svg.selectAll("circle").remove();
    
    // Add a circle
    svg.append('circle')
      .attr('cx', svgWidth / 2)
      .attr('cy', svgHeight / 2)
      .attr('r', Math.min(svgWidth, svgHeight) / 2 * (radius / 25)) // scale the radius
      // fill with a mathematically generated color based upon the radius
      .attr('fill', `hsl(${Math.round((radius / 25) * 360)}, 100%, 50%)`)
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