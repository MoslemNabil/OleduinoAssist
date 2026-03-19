import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import CodePreview from './components/CodePreview';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/constants';
import { processFramesToHex } from './utils/imageUtils';
import { extractFramesFromFile } from './engine/mediaEngine';
import { generateDeviceCode } from './engine/generator';

export default function App() {
  // --- Global State ---
  const [frames, setFrames] = useState(['']);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(10);

  // --- Tool & Config State ---
  const [tool, setTool] = useState('pen');
  const [strokeSize, setStrokeSize] = useState(1);
  const [board, setBoard] = useState('arduino_uno');
  const [protocol, setProtocol] = useState('i2c');
  const [language, setLanguage] = useState('cpp');

  // --- Output State ---
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Refs ---
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const playIntervalRef = useRef(null);

  // --- Canvas Core Logic ---
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  const saveCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setFrames(prev => {
      const newFrames = [...prev];
      newFrames[currentFrameIdx] = dataUrl;
      return newFrames;
    });
  }, [currentFrameIdx]);

  const loadFrame = useCallback((index, framesToUse = frames) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!framesToUse[index]) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0);
    };
    img.src = framesToUse[index];
  }, [frames]);

  // Lifecycle
  useEffect(() => { initCanvas(); saveCurrentFrame(); }, []);
  useEffect(() => { if (!isPlaying) loadFrame(currentFrameIdx); }, [currentFrameIdx, isPlaying, loadFrame]);

  // --- Drawing Events ---
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY)
    };
  };

  const startDrawing = (e) => { isDrawing.current = true; lastPos.current = getMousePos(e); draw(e); };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getMousePos(e);
    ctx.strokeStyle = tool === 'eraser' ? 'black' : 'white';
    ctx.fillStyle = tool === 'eraser' ? 'black' : 'white';
    ctx.lineWidth = strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (strokeSize === 1 && pos.x === lastPos.current.x && pos.y === lastPos.current.y) {
      ctx.fillRect(pos.x, pos.y, 1, 1);
    }
    lastPos.current = pos;
  };

  const stopDrawing = () => { if (isDrawing.current) { isDrawing.current = false; saveCurrentFrame(); } };
  const clearCanvas = () => { initCanvas(); saveCurrentFrame(); };

  // --- Timeline Actions ---
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => setCurrentFrameIdx(prev => (prev + 1) % frames.length), 1000 / fps);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, frames.length, fps]);

  const addFrame = () => { setFrames(prev => [...prev, '']); setCurrentFrameIdx(frames.length); };

  const duplicateFrame = () => {
    setFrames(prev => {
      const newFrames = [...prev];
      newFrames.splice(currentFrameIdx + 1, 0, prev[currentFrameIdx]);
      return newFrames;
    });
    setCurrentFrameIdx(currentFrameIdx + 1);
  };

  const deleteFrame = (index) => {
    if (frames.length === 1) { clearCanvas(); return; }
    setFrames(prev => prev.filter((_, i) => i !== index));
    if (currentFrameIdx >= frames.length - 1) setCurrentFrameIdx(Math.max(0, frames.length - 2));
  };

  // --- Handlers ---
  const handleLoadExample = (type) => {
    if (type === 'smiley') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = 'black'; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = 'white'; ctx.fillStyle = 'white'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(64, 32, 28, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(52, 24, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(76, 24, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(64, 32, 16, 0.2, Math.PI - 0.2, false); ctx.stroke();
      setFrames([canvasRef.current.toDataURL('image/png')]);
      setCurrentFrameIdx(0);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const extractedFrames = await extractFramesFromFile(file);
      if (extractedFrames.length > 0) {
        setFrames(extractedFrames);
        setCurrentFrameIdx(0);
      }
    } catch (err) {
      console.error("Media processing error:", err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateCode = async () => {
    const framesData = await processFramesToHex(frames);
    const code = generateDeviceCode(framesData, { fps, board, protocol, language });
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = generatedCode;
      textArea.style.top = "0"; textArea.style.left = "0"; textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus(); textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Failed to copy text: ', err); }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header onLoadExample={handleLoadExample} onGenerate={handleGenerateCode} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <Sidebar
          config={{ tool, setTool, strokeSize, setStrokeSize, board, setBoard, protocol, setProtocol, language, setLanguage, clearCanvas }}
          mediaState={{ isProcessing, onFileUpload: handleFileUpload, fileInputRef }}
        />

        <section className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800 relative">
          {/* Canvas Workspace */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="relative group p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
              <canvas
                ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerLeave={stopDrawing}
                className="bg-black cursor-crosshair touch-none"
                style={{ width: '512px', height: '256px', imageRendering: 'pixelated', boxShadow: '0 0 20px rgba(0,255,255,0.05)' }}
              />
              <div className="absolute top-0 right-0 p-2 text-slate-600 text-xs font-mono opacity-50 pointer-events-none">
                128x64 SSD1306
              </div>
            </div>
          </div>

          <Timeline timelineState={{ frames, currentFrameIdx, setCurrentFrameIdx, isPlaying, togglePlay, fps, setFps, addFrame, duplicateFrame, deleteFrame }} />
        </section>

        <CodePreview generatedCode={generatedCode} language={language} onCopy={handleCopyCode} copied={copied} />
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
