import React, { useState, useEffect, useRef } from 'react';
import { FaPen, FaEraser, FaTrash, FaTimes } from 'react-icons/fa';
import { fabric } from 'fabric'; // Correct import for most Fabric.js versions

const Whiteboard = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    // Initialize canvas only once
    if (!canvasRef.current || canvasRef.current.fabricCanvas) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 800,
      height: 500,
      backgroundColor: '#ffffff'
    });

    // Configure brush
    initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
    initCanvas.freeDrawingBrush.color = brushColor;
    initCanvas.freeDrawingBrush.width = brushSize;
    
    // Mark canvas as initialized
    canvasRef.current.fabricCanvas = initCanvas;
    setCanvas(initCanvas);

    return () => {
      // Clean up on unmount
      if (initCanvas) {
        initCanvas.dispose();
        canvasRef.current.fabricCanvas = null;
      }
    };
  }, []);

  // Update brush when properties change
  useEffect(() => {
    if (!canvas) return;
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushSize;
  }, [brushColor, brushSize, canvas]);

  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !isDrawing;
    setIsDrawing(!isDrawing);
    canvas.freeDrawingBrush.color = isDrawing ? '#ffffff' : brushColor;
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    }
  };

  return (
    <div className="whiteboard-modal">
      <div className="whiteboard-header">
        <h2>Virtual Whiteboard</h2>
        <button onClick={onClose} className="close-btn">
          <FaTimes /> Close
        </button>
      </div>
      <div className="whiteboard-toolbar">
        <button 
          onClick={toggleDrawingMode} 
          className={`tool-btn ${isDrawing ? 'active' : ''}`}
        >
          {isDrawing ? <FaPen /> : <FaEraser />}
          {isDrawing ? ' Drawing' : ' Eraser'}
        </button>
        <div className="tool-group">
          <label>Color:</label>
          <input 
            type="color" 
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </div>
        <div className="tool-group">
          <label>Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>
        <button onClick={clearCanvas} className="tool-btn">
          <FaTrash /> Clear
        </button>
      </div>
      <canvas 
        ref={canvasRef}
        id="whiteboard-canvas"
        width={800}
        height={500}
      />
    </div>
  );
};

export default Whiteboard;