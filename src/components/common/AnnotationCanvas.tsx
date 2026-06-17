import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Pencil,
  Type,
  Square,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/utils';
import type { Annotation } from '@/types';

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  onChange?: (annotations: Annotation[]) => void;
  readOnly?: boolean;
}

type ToolType = 'pen' | 'text' | 'rect' | 'highlight' | 'eraser';

const colors = [
  '#EF4444',
  '#F59E0B',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#000000'
];

const AnnotationCanvas = ({ imageUrl, annotations, onChange, readOnly = false }: AnnotationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState('#EF4444');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Annotation[][]>([annotations]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textInput, setTextInput] = useState<{ x: number; y: number; text: string } | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  const pushHistory = useCallback((newAnnotations: Annotation[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange?.(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange?.(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    const newAnnotations: Annotation[] = [];
    pushHistory(newAnnotations);
    onChange?.(newAnnotations);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
    img.src = imageUrl;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      if (imageRef.current) {
        const img = imageRef.current;
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvasWidth - w) / 2;
        const y = (canvasHeight - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }

      const currentAnnotations = history[historyIndex] || [];
      currentAnnotations.forEach(ann => {
        drawAnnotation(ctx, ann);
      });

      if (isDrawing && currentPath.length > 0 && (currentTool === 'pen' || currentTool === 'eraser')) {
        ctx.beginPath();
        ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
        ctx.lineWidth = currentTool === 'eraser' ? strokeWidth * 3 : strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (currentTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
        }
        currentPath.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }

      if (isDrawing && startPos && currentTool === 'rect') {
        const endPos = currentPath[currentPath.length - 1];
        if (endPos) {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = strokeWidth;
          ctx.strokeRect(
            startPos.x,
            startPos.y,
            endPos.x - startPos.x,
            endPos.y - startPos.y
          );
        }
      }

      if (isDrawing && startPos && currentTool === 'highlight') {
        const endPos = currentPath[currentPath.length - 1];
        if (endPos) {
          ctx.fillStyle = currentColor + '40';
          ctx.fillRect(
            startPos.x,
            startPos.y,
            endPos.x - startPos.x,
            endPos.y - startPos.y
          );
        }
      }
    };

    drawCanvas();
  }, [imageUrl, history, historyIndex, isDrawing, currentPath, currentTool, currentColor, strokeWidth, startPos]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, ann: Annotation) => {
    ctx.save();
    
    switch (ann.type) {
      case 'pen':
        if (ann.points && ann.points.length > 0) {
          ctx.beginPath();
          ctx.strokeStyle = ann.color;
          ctx.lineWidth = ann.strokeWidth || 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ann.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
        break;
      case 'rect':
        if (ann.x !== undefined && ann.y !== undefined && ann.width && ann.height) {
          ctx.strokeStyle = ann.color;
          ctx.lineWidth = ann.strokeWidth || 3;
          ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
        }
        break;
      case 'highlight':
        if (ann.x !== undefined && ann.y !== undefined && ann.width && ann.height) {
          ctx.fillStyle = ann.color + '40';
          ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
        }
        break;
      case 'text':
        if (ann.text && ann.x !== undefined && ann.y !== undefined) {
          ctx.font = '16px sans-serif';
          ctx.fillStyle = ann.color;
          ctx.fillText(ann.text, ann.x, ann.y);
        }
        break;
    }
    
    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPath([pos]);

    if (currentTool === 'text') {
      setTextInput({ x: pos.x, y: pos.y, text: '' });
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    const pos = getCanvasCoords(e);
    setCurrentPath(prev => [...prev, pos]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || readOnly) return;
    
    setIsDrawing(false);
    
    if (currentTool === 'pen' && currentPath.length > 1) {
      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        type: 'pen',
        pageIndex: 0,
        color: currentColor,
        strokeWidth,
        points: currentPath
      };
      const newAnnotations = [...(history[historyIndex] || []), newAnnotation];
      pushHistory(newAnnotations);
      onChange?.(newAnnotations);
    } else if (currentTool === 'rect' && startPos && currentPath.length > 0) {
      const endPos = currentPath[currentPath.length - 1];
      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        type: 'rect',
        pageIndex: 0,
        color: currentColor,
        strokeWidth,
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(endPos.x - startPos.x),
        height: Math.abs(endPos.y - startPos.y)
      };
      const newAnnotations = [...(history[historyIndex] || []), newAnnotation];
      pushHistory(newAnnotations);
      onChange?.(newAnnotations);
    } else if (currentTool === 'highlight' && startPos && currentPath.length > 0) {
      const endPos = currentPath[currentPath.length - 1];
      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        type: 'highlight',
        pageIndex: 0,
        color: currentColor,
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(endPos.x - startPos.x),
        height: Math.abs(endPos.y - startPos.y)
      };
      const newAnnotations = [...(history[historyIndex] || []), newAnnotation];
      pushHistory(newAnnotations);
      onChange?.(newAnnotations);
    }

    setCurrentPath([]);
    setStartPos(null);
  };

  const handleTextSubmit = () => {
    if (!textInput || !textInput.text.trim()) {
      setTextInput(null);
      return;
    }

    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      type: 'text',
      pageIndex: 0,
      color: currentColor,
      x: textInput.x,
      y: textInput.y,
      text: textInput.text
    };
    const newAnnotations = [...(history[historyIndex] || []), newAnnotation];
    pushHistory(newAnnotations);
    onChange?.(newAnnotations);
    setTextInput(null);
  };

  const tools = [
    { type: 'pen' as ToolType, icon: Pencil, label: '画笔' },
    { type: 'text' as ToolType, icon: Type, label: '文字' },
    { type: 'rect' as ToolType, icon: Square, label: '矩形' },
    { type: 'highlight' as ToolType, icon: Highlighter, label: '荧光笔' },
    { type: 'eraser' as ToolType, icon: Eraser, label: '橡皮擦' },
  ];

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="flex items-center justify-between p-3 bg-white border-b border-neutral-200 rounded-t-xl">
          <div className="flex items-center gap-1">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.type}
                  onClick={() => setCurrentTool(tool.type)}
                  className={cn(
                    "p-2.5 rounded-lg transition-colors",
                    currentTool === tool.type
                      ? "bg-primary-100 text-primary-600"
                      : "text-neutral-500 hover:bg-neutral-100"
                  )}
                  title={tool.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            
            <div className="w-px h-6 bg-neutral-200 mx-2" />
            
            <div className="flex items-center gap-1.5">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    currentColor === color
                      ? "border-neutral-800 scale-110"
                      : "border-white shadow-sm hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="w-px h-6 bg-neutral-200 mx-2" />
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">粗细</span>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="撤销"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="重做"
            >
              <Redo2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
              title="清除全部"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-neutral-200 mx-2" />
            
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm text-neutral-600 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 bg-neutral-100 overflow-auto flex items-center justify-center p-4"
        style={{ 
          minHeight: readOnly ? '500px' : '450px',
          borderRadius: readOnly ? '12px' : '0 0 12px 12px'
        }}
      >
        <div
          className="relative bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={cn(
              "block",
              !readOnly && "cursor-crosshair"
            )}
          />
          
          {textInput && (
            <div
              className="absolute"
              style={{ left: textInput.x, top: textInput.y - 20 }}
            >
              <input
                type="text"
                autoFocus
                value={textInput.text}
                onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                onBlur={handleTextSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTextSubmit();
                  if (e.key === 'Escape') setTextInput(null);
                }}
                className="bg-transparent border-b-2 border-current outline-none text-base"
                style={{ color: currentColor, minWidth: '100px' }}
                placeholder="输入文字..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationCanvas;
