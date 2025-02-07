"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

export default function SlatSpacingCalculator() {
  const [distance, setDistance] = useState("");
  const [spaces, setSpaces] = useState("");
  const [width, setWidth] = useState("");
  const [result, setResult] = useState("");
  const canvasRef = useRef(null);

  const calculateSpacing = useCallback(() => {
    if (!distance || !spaces || !width) return;
    const totalDistance = parseFloat(distance);
    const numSpaces = parseInt(spaces);
    const slatWidth = parseFloat(width);

    if (
      isNaN(totalDistance) ||
      isNaN(numSpaces) ||
      isNaN(slatWidth) ||
      numSpaces <= 1
    ) {
      setResult("Please enter valid numbers!");
      return;
    }

    const spacing = (totalDistance - (numSpaces - 1) * slatWidth) / numSpaces;
    setResult(`Spacing between slats: ${spacing.toFixed(2)} cm`);
    drawSketch(totalDistance, numSpaces + 1, slatWidth, spacing);
  }, [distance, spaces, width]);

  const drawSketch = (_totalDistance, numSpaces, slatWidth, spacing) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ Set a fixed canvas height
    const fixedCanvasHeight = 150;
    canvas.height = fixedCanvasHeight;

    // ✅ Constrain canvas width within a range
    const minCanvasWidth = 300;
    const maxCanvasWidth = Math.min(window.innerWidth * 0.9, 600);
    const requiredWidth = numSpaces * slatWidth + (numSpaces - 1) * spacing;

    // ✅ Dynamically set canvas width without affecting height
    canvas.width = Math.max(
      minCanvasWidth,
      Math.min(maxCanvasWidth, requiredWidth + 40)
    );

    // ✅ Scale width proportionally, height stays fixed
    const scaleX = (canvas.width - 40) / requiredWidth;
    const elementHeight = 50; // Fixed height for slats and spaces
    const startY = (fixedCanvasHeight - elementHeight) / 2; // Center vertically

    // ✅ Center drawing horizontally
    let x = (canvas.width - requiredWidth * scaleX) / 2;

    // 🔥 **Final Fix: Correct start and end positions**
    const firstSlatInnerEdge = x + slatWidth * scaleX; // Start after first slat
    const lastSlatInnerEdge =
      firstSlatInnerEdge +
      (numSpaces - 2) * (slatWidth * scaleX + spacing * scaleX) +
      spacing * scaleX;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSpaces; i++) {
      ctx.fillStyle = "#007BFF"; // Slat (Blue)
      ctx.fillRect(x, startY, slatWidth * scaleX, elementHeight);
      x += slatWidth * scaleX;

      if (i < numSpaces - 1) {
        ctx.fillStyle = "#FF0000"; // Spacing (Red)
        ctx.fillRect(x, startY, spacing * scaleX, elementHeight);
        x += spacing * scaleX;
      }
    }

    // ✅ Draw the correctly positioned black line
    const lineY = startY - 20; // 20px above the slats
    ctx.strokeStyle = "#666464";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(firstSlatInnerEdge, lineY); // Start after first slat
    ctx.lineTo(lastSlatInnerEdge, lineY); // ✅ End before last slat
    ctx.stroke();
  };

  const resetCalculator = () => {
    setDistance("");
    setSpaces("");
    setWidth("");
    setResult("");
    const canvas = canvasRef.current;
    canvas.width = canvas.width;
  };

  useEffect(() => {
    window.addEventListener("resize", calculateSpacing);
    return () => window.removeEventListener("resize", calculateSpacing);
  }, [calculateSpacing]);

  return (
    <div className="max-w-lg mx-auto text-left p-4">
      <div className="text-left mr-5">
        <Link className=" text-xl" href="/">
          ⬅️
        </Link>
      </div>
      <h2 className="text-xl text-left font-bold">
        Tom&apos;s Slat Spacing Calculator
      </h2>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <label className="block text-gray-700 text-sm">
          Span between inside edge of end slats (cm):
        </label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-2 text-black border rounded mb-3"
        />

        <label className="block text-gray-700 text-sm">Number of Spaces:</label>
        <input
          type="number"
          value={spaces}
          onChange={(e) => setSpaces(e.target.value)}
          className="w-full p-2 text-black border rounded mb-3"
        />

        <label className="block text-gray-700 text-sm">Slat Width (cm):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="w-full p-2 text-black border rounded mb-3"
        />
        <div className="flex gap-3">
          <button
            onClick={calculateSpacing}
            className="flex-1 bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-600 text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-2 text-left font-semibold text-black text-lg">
        {result}
      </div>

      <div className="mt-2">
        <h3 className="text-lg text-slate-600 text-left font-semibold">
          Basic Sketch
        </h3>
        <canvas
          ref={canvasRef}
          className="border rounded w-full max-w-md bg-gray-100 mt-2"
        ></canvas>
        <div className="mt-3 text-left">
          <p>
            <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
            Slat Width: {width || "0"} cm
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-[#FF0000] mr-2"></span>
            Spacing Between Slats: {result.split(": ")[1] || "0 cm"}
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-[#666464] mr-2"></span>
            Total Distance: {distance || "0"} cm
          </p>
        </div>
      </div>
    </div>
  );
}
