import React, { useState, useRef } from 'react';
import './App.css';
import FoldLineControls from './components/FoldLineControls';
import SheetPreview from './components/SheetPreview';
import { Canvg } from 'canvg';



function App() {
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(100);
  const [foldLines, setFoldLines] = useState([]); 
  const [sheetSize, setSheetSize] = useState({ width: 500, height: 300 });
  const [newFold, setNewFold] = useState('');
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(1); // 1 means no zoom
const [pan, setPan] = useState({ x: 0, y: 0 }); // Position of the pan (x, y)

  

  const downloadSVG = () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sheet-design.svg';
    link.click();
  };

  const downloadPNG = async () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement('canvas');
    canvas.width = length;
    canvas.height = width;

    const ctx = canvas.getContext('2d');
    const v = await Canvg.fromString(ctx, svgData);
    await v.render();

    const pngUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'sheet-design.png';
    link.href = pngUrl;
    link.click();
  };

  const saveDesign = () => {
    const design = {
      length,
      width,
      foldLines,
    };
    localStorage.setItem('sheetDesign', JSON.stringify(design));
    alert('Design saved!');
  };
  
  const loadDesign = () => {
    const data = localStorage.getItem('sheetDesign');
    if (data) {
      const design = JSON.parse(data);
      setLength(design.length);
      setWidth(design.width);
      setFoldLines(design.foldLines);
      alert('Design loaded!');
    } else {
      alert('No saved design found.');
    }
  };

  const downloadDXF = () => {
    const header = `0
  SECTION
  2
  HEADER
  0
  ENDSEC
  0
  SECTION
  2
  TABLES
  0
  ENDSEC
  0
  SECTION
  2
  BLOCKS
  0
  ENDSEC
  0
  SECTION
  2
  ENTITIES`;
  
    const footer = `0
  ENDSEC
  0
  SECTION
  2
  OBJECTS
  0
  ENDSEC
  0
  EOF`;
  
    // Start DXF content
    let dxfContent = header;
  
    // Add lines for fold lines
    foldLines.forEach((pos) => {
      dxfContent += `
  0
  LINE
  8
  0
  10
  ${pos}
  20
  0.0
  30
  0.0
  10
  ${pos}
  20
  ${width}
  30
  0.0`;
    });
  
    dxfContent += footer;
  
    // Convert content to a Blob and initiate download
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sheet-design.dxf';
    link.click();
  };
  
  // Zoom In
const zoomIn = () => {
  setZoom(zoom + 0.1);
};

// Zoom Out
const zoomOut = () => {
  setZoom(Math.max(zoom - 0.1, 0.1)); // Prevent zooming out too far
};

// Handle Pan (Move Canvas)
const handleMouseDown = (e) => {
  const startX = e.clientX;
  const startY = e.clientY;

  const onMouseMove = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    setPan((prevPan) => ({
      x: prevPan.x + deltaX,
      y: prevPan.y + deltaY,
    }));
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

  return (
    <div className="container">
      <h1>Sheet Metal Design Tool</h1>

      <div className="inputs">
        <label>
          Length (mm):
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </label>
        <label>
          Width (mm):
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </label>
      </div>

      <FoldLineControls
        foldLines={foldLines}
        setFoldLines={setFoldLines}
        newFold={newFold}
        setNewFold={setNewFold}
      />

      <SheetPreview
        length={length}
        width={width}
        foldLines={foldLines}
        setFoldLines={setFoldLines}
        svgRef={svgRef}
        zoom={zoom}
  pan={pan}
  onMouseDown={handleMouseDown}
      />

<div className="actions">
  <button onClick={downloadSVG}>Download as SVG</button>
  <button onClick={downloadPNG}>Download as PNG</button>
  <button onClick={saveDesign}>💾 Save Design</button>
  <button onClick={loadDesign}>📂 Load Design</button>
  <button onClick={downloadDXF}>Download as DXF</button>
  <button onClick={zoomIn}>Zoom In</button>
<button onClick={zoomOut}>Zoom Out</button>

</div>

    </div>
  );
}

export default App;
