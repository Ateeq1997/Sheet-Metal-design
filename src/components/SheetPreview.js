import React, { useRef } from 'react';

function SheetPreview({ length, width, foldLines, setFoldLines, svgRef, zoom, setZoom, pan, setPan }) {  /* SheetPreview function and this function can use these props directly inside the function. */


  const isPanning = useRef(false);  //ensure that the user currently dragging the sheet
  const start = useRef({ x: 0, y: 0 }); // stores the starting mouse position when dragging begins

  // Drag fold circles
  const handleDrag = (index, e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const positionInSvg = mouseX / zoom + pan.x;

    const updatedFolds = [...foldLines];
    updatedFolds[index].position = Math.max(0, Math.min(length, positionInSvg));  // calculates the new position of the fold in the SVG coordinates and updates the corresponding fold's position
    setFoldLines(updatedFolds);
  };

  // 🛠️ Pan functions
  const handleMouseDown = (e) => { //Start panning function
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      isPanning.current = true;
      start.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e) => {   // Update Panning function
    if (!isPanning.current) return;
    const dx = (e.clientX - start.current.x) / zoom;
    const dy = (e.clientY - start.current.y) / zoom;
    setPan((prev) => ({
      x: prev.x - dx,
      y: prev.y - dy
    }));
    start.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {   // Stop Panning function
    isPanning.current = false;
  };

  return (
    <svg    // This entire section is the canvas that displays the sheet and fold lines.
      ref={svgRef}
      width={length * zoom}
      height={width * zoom}
      viewBox={`${-pan.x} ${-pan.y} ${length} ${width}`}
      className="svg-preview"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={(e) => {  // This handles zoom in/out when the user scrolls with the mouse wheel.
        e.preventDefault();
        const scaleAmount = 0.1;
        if (e.deltaY < 0) {
          setZoom(prev => Math.min(prev + scaleAmount, 5));  //zoom is adjusted within limits (between 0.1 and 5)
        } else {
          setZoom(prev => Math.max(prev - scaleAmount, 0.1));
        }
      }}
      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
    >
      
      <rect x="0" y="0" width={length} height={width} fill="#f0f0f0" stroke="#000"  // Draws the base rectangle representing the sheet.
      />

      {foldLines.map((fold, index) => (  // Loop over fold lines
        <g key={index}>
          <line     // A dashed vertical line
            x1={fold.position * zoom}
            y1="0"
            x2={fold.position * zoom}
            y2={width * zoom}
            stroke="blue"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text        // A text arrow (↑ or ↓) based on direction
            x={fold.position * zoom + 8}
            y={50 * zoom}
            fontSize={30 * zoom}
            fontWeight="bold"
            fill="blue"
            pointerEvents="none"
          >
            {fold.direction === 'inward' ? '↓' : '↑'}
          </text>
          <circle        // A red draggable circle (you can move the fold)
            cx={fold.position * zoom}
            cy={(width / 2) * zoom}
            r={6 * zoom}
            fill="red"
            cursor="ew-resize"
            onMouseDown={(e) => {   // dragging the circle of fold
              e.preventDefault();
              const onMouseMove = (ev) => handleDrag(index, ev);   // calls handleDrag() to move the fold circle
              const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
              };
              window.addEventListener('mousemove', onMouseMove);
              window.addEventListener('mouseup', onMouseUp);
            }}
          />
        </g>
      ))}

    </svg>
  );
}

export default SheetPreview;
