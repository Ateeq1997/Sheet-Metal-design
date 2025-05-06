import React from 'react';

/* This component FoldLineControls is responsible for managing the UI controls to add, remove, and update fold lines on a sheet.*/

function FoldLineControls({ foldLines, setFoldLines, newFold, setNewFold }) { 

  const addFoldLine = () => {    // Function for addfoldline
    const pos = parseFloat(newFold);   //Converts the newFold input to a number (parseFloat)
    if (!isNaN(pos) && pos > 0) {
      setFoldLines([...foldLines, { position: pos, direction: 'inward' }]);    //If valid and positive, adds a new fold line object { position, direction: 'inward' } to the foldLines array
      setNewFold('');      // Then clears the input field
    }
  };

  const removeFoldLine = (index) => {   //Function for removeFoldLine
    const updated = [...foldLines];
    updated.splice(index, 1);    //Removes a fold line at a specific index from the list
    setFoldLines(updated);
  };

  const updateDirection = (index, newDirection) => {     // Function for updateDirection
    const updated = [...foldLines];
    updated[index].direction = newDirection;   //Updates the direction (inward or outward) of a specific fold line
    setFoldLines(updated);
  };

  return (
    <div>
      <div className="fold-line-controls">
        <input
          type="number"
          placeholder="Fold at (mm)" //User types a position in mm → it’s stored in newFold
          value={newFold}
          onChange={(e) => setNewFold(e.target.value)}
        />
        <button onClick={addFoldLine}   // Clicking the button calls addFoldLine()
        >Add Fold Line</button>
      </div>


      <div className="fold-lines-list">
        {foldLines.map((fold, index) => (  // Displays each fold line’s position and direction
          <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}> 
            <span>Fold at {fold.position} mm</span>  
            <select
  value={fold.direction}  
  onChange={(e) => updateDirection(index, e.target.value)}  // Allows changing the direction via a dropdown
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
            <button onClick={() => removeFoldLine(index)}  //Provides a "Remove" button for each fold
              >Remove</button> 
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoldLineControls;
