import React from 'react';

function FoldLineControls({ foldLines, setFoldLines, newFold, setNewFold }) {
  const addFoldLine = () => {
    const pos = parseFloat(newFold);
    if (!isNaN(pos) && pos > 0) {
      setFoldLines([...foldLines, { position: pos, direction: 'inward' }]);
      setNewFold('');
    }
  };

  const removeFoldLine = (index) => {
    const updated = [...foldLines];
    updated.splice(index, 1);
    setFoldLines(updated);
  };

  const updateDirection = (index, newDirection) => {
    const updated = [...foldLines];
    updated[index].direction = newDirection;
    setFoldLines(updated);
  };

  return (
    <div>
      <div className="fold-line-controls">
        <input
          type="number"
          placeholder="Fold at (mm)"
          value={newFold}
          onChange={(e) => setNewFold(e.target.value)}
        />
        <button onClick={addFoldLine}>Add Fold Line</button>
      </div>

      <div className="fold-lines-list">
        {foldLines.map((fold, index) => (
          <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Fold at {fold.position} mm</span>
            <select
  value={fold.direction}
  onChange={(e) => updateDirection(index, e.target.value)}
  style={{
    padding: '4px 8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer'
  }}
>
              <option value="inward">Inward</option>
              <option value="outward">Outward</option>
            </select>
            <button onClick={() => removeFoldLine(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoldLineControls;
