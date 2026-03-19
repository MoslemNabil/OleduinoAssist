import React from 'react';
import { Upload, Loader2, MousePointer2, Pen, Eraser, RotateCcw, Settings } from 'lucide-react';
import { BOARD_PRESETS } from '../utils/constants';

const Sidebar = ({ config, setConfig, mediaState }) => {
  const { tool, setTool, strokeSize, setStrokeSize, board, setBoard, protocol, setProtocol, language, setLanguage, clearCanvas } = config;
  const { isProcessing, onFileUpload, fileInputRef } = mediaState;

  return (
    <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 overflow-y-auto">
      {/* Media Upload */}
      <section>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <Upload className="w-4 h-4 mr-2"/> Import Media
        </h2>
        <input type="file" ref={fileInputRef} hidden accept="image/*,video/mp4,video/webm" onChange={onFileUpload} />
        <button
          onClick={() => fileInputRef.current?.click()} disabled={isProcessing}
          className="w-full py-2.5 flex items-center justify-center rounded border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-cyan-500" /> : <Upload className="w-4 h-4 mr-2" />}
          {isProcessing ? 'Processing...' : 'Upload Image / Video'}
        </button>
        <p className="text-[10px] text-slate-500 mt-2 text-center leading-tight">
          Auto-converts to 128x64 monochrome.<br/>Videos capped at 3s @ 10FPS.
        </p>
      </section>

      {/* Drawing Tools */}
      <section>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <MousePointer2 className="w-4 h-4 mr-2"/> Drawing Tools
        </h2>
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setTool('pen')} className={`flex-1 py-2 flex justify-center rounded border transition ${tool === 'pen' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>
            <Pen className="w-5 h-5" />
          </button>
          <button onClick={() => setTool('eraser')} className={`flex-1 py-2 flex justify-center rounded border transition ${tool === 'eraser' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>
            <Eraser className="w-5 h-5" />
          </button>
          <button onClick={clearCanvas} className="flex-1 py-2 flex justify-center rounded border border-slate-700 hover:bg-rose-900/30 hover:text-rose-400 hover:border-rose-800 transition">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Brush Size: {strokeSize}px</label>
          <input type="range" min="1" max="10" value={strokeSize} onChange={(e) => setStrokeSize(parseInt(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </section>

      {/* Board Config */}
      <section>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2"/> Board Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target Board</label>
            <select value={board} onChange={(e) => setBoard(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 focus:outline-none">
              {Object.entries(BOARD_PRESETS).map(([key, data]) => (<option key={key} value={key}>{data.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Language</label>
            <div className="flex space-x-2">
              <button onClick={() => setLanguage('cpp')} className={`flex-1 py-1.5 text-sm rounded border transition ${language === 'cpp' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>C++</button>
              <button onClick={() => setLanguage('micropython')} className={`flex-1 py-1.5 text-sm rounded border transition ${language === 'micropython' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>MicroPython</button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Protocol</label>
            <div className="flex space-x-2">
              <button onClick={() => setProtocol('i2c')} className={`flex-1 py-1.5 text-sm rounded border transition ${protocol === 'i2c' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>I2C</button>
              <button onClick={() => setProtocol('spi')} className={`flex-1 py-1.5 text-sm rounded border transition ${protocol === 'spi' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'border-slate-700 hover:bg-slate-800'}`}>SPI</button>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded text-xs border border-slate-800">
            <span className="text-slate-500 block mb-1">Recommended Wiring:</span>
            <span className="text-cyan-400 font-mono">{BOARD_PRESETS[board][protocol]}</span>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
