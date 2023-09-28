'use client'

import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function Home() {
  const maxRadius = 25;
  const [radius, setRadius] = useState(1);
  const diameter = radius * 2;
  const circumference = Math.round(((diameter * Math.PI) + Number.EPSILON) * 1000) / 1000

  // referenceAngle is the reference angle of the overlays (radius, diameter, etc.) for the circle
  // To calculate motion, we can simply move our radius and our referenceAngle.
  // We could possibly use a vertex, but no plans for that yet
  const startingReferenceAngle = 10;
  const [referenceAngle, setReferenceAngle] = useState(startingReferenceAngle);
  // rotationVelocity is velocity of the circle in degrees per second. can be positive or negative.
  const startingRotationVelocity = .001;
  const [rotationVelocity, setRotationVelocity] = useState(startingRotationVelocity);
  // radiusVelocity is velocity of the radius expansion or contraction in px per second. can be positive or negative.
  // note maybe should be implemented as percentage of min/max radius
  const startingRadiusVelocity = 1;
  const [radiusVelocity, setRadiusVelocity] = useState(startingRadiusVelocity);
  // friction is a constant that gives motion a sticky feeling. 0 is no friction, 1 is max friction
  const radiusFriction = .85
  const [radiusDelta, setRadiusDelta] = useState(0);
  const rotationFriction = .9;
  const [rotationDelta, setRotationDelta] = useState(0);

  const area = Math.round((Math.PI * Math.pow(radius, 2) + Number.EPSILON) * 1000) / 1000;
  const svgWidth = 600;
  const svgHeight = 600;

  useEffect(() => {
    let animationFrameId: number | undefined

    const animate = () => {
      // Update the state variables
      setRotationDelta(prevDelta => prevDelta * rotationFriction);
      setRotationVelocity(prevVelocity => prevVelocity * rotationDelta);
      setRadiusDelta(prevDelta => prevDelta * radiusFriction);
      setRadiusVelocity(prevVelocity => prevVelocity * radiusDelta);
      setRadius(prevRadius => Math.min(maxRadius, Math.max(1, prevRadius + radiusVelocity)));
      setReferenceAngle(prevAngle => prevAngle + rotationVelocity);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      // Cleanup: cancel the animation frame
      if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      }
    };
  }, [radius, referenceAngle, radiusVelocity, rotationVelocity, radiusDelta, rotationDelta, radiusFriction, rotationFriction]);

  useEffect(() => {
    const svg = d3.select('#circles-svg');
    svg.selectAll('*').remove();

    const scaledRadius = Math.min(svgWidth, svgHeight) / 2 * (radius / 25);
    const fill = `hsl(${Math.round((radius / 25) * 360)}, 100%, 50%)`;

    // Draw the circle
    svg.append('circle')
      .attr('cx', svgWidth / 2)
      .attr('cy', svgHeight / 2)
      .attr('r', scaledRadius)
      .attr('fill', fill);

    // Convert reference angle to radians
    const angleInRadians = (referenceAngle * Math.PI) / 180;

    // Draw the radius line
    svg.append('line')
      .attr('x1', svgWidth / 2)
      .attr('y1', svgHeight / 2)
      .attr('x2', svgWidth / 2 + Math.cos(angleInRadians) * scaledRadius)
      .attr('y2', svgHeight / 2 - Math.sin(angleInRadians) * scaledRadius)
      .attr('stroke', 'black')
      .attr('stroke-width', 3);

    // Draw the label
    svg.append('text')
      .attr('x', svgWidth / 2 + Math.cos(angleInRadians) * scaledRadius + 10)
      .attr('y', svgHeight / 2 - Math.sin(angleInRadians) * scaledRadius - 4)
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .text(`${radius.toFixed(2)}`);
  }, [radius, referenceAngle]);

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
    <div>
      {radiusVelocity.toFixed(2)} {radiusDelta.toFixed(2)} {rotationVelocity.toFixed(2)} { rotationDelta.toFixed(2)}
    </div>
  </main>
  )
}