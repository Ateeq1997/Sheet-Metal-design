import React from 'react';

function SheetPreview({ length, width, foldLines, setFoldLines, svgRef, zoom, pan }) {
  const handleDrag = (index, e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;

    const updatedFolds = [...foldLines];
    updatedFolds[index].position = Math.max(0, Math.min(length, mouseX));
    setFoldLines(updatedFolds);
  };

  return (
    <svg
      ref={svgRef}
      width={length * zoom}  // Apply zoom to width
      height={width * zoom}  // Apply zoom to height
      viewBox={`${-pan.x} ${-pan.y} ${length} ${width}`}  // Adjust viewBox to pan and zoom
      className="svg-preview"
    >
      <rect x="0" y="0" width={length} height={width} fill="#f0f0f0" stroke="#000" />

      {foldLines.map((fold, index) => (
        <g key={index}>
          <line
            x1={fold.position * zoom} // Apply zoom to fold position
            y1="0"
            x2={fold.position * zoom} // Apply zoom to fold position
            y2={width * zoom} // Apply zoom to height
            stroke="blue"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text
            x={fold.position * zoom + 8} // Apply zoom to position
            y={50 * zoom} // Apply zoom to position
            fontSize={30 * zoom} // Scale text size with zoom
            fontWeight="bold"
            fill="blue"
            pointerEvents="none"
          >
            {fold.direction === 'inward' ? '↓' : '↑'}
          </text>
          <circle
            cx={fold.position * zoom} // Apply zoom to fold position
            cy={width / 2 * zoom} // Apply zoom to fold position
            r={6 * zoom} // Apply zoom to radius
            fill="red"
            cursor="ew-resize"
            onMouseDown={(e) => {
              e.preventDefault();
              const onMouseMove = (ev) => handleDrag(index, ev);
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
