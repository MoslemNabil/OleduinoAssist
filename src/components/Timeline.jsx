import React from 'react';
import { Pause, Play, Copy, Plus, Trash2 } from 'lucide-react';

const Timeline = ({ timelineState }) => {
  const { frames, currentFrameIdx, setCurrentFrameIdx, isPlaying, togglePlay, fps, setFps, addFrame, duplicateFrame, deleteFrame } = timelineState;

  return (
    <div className="h-48 bg-slate-900 border-t border-slate-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-4">
          <button onClick={togglePlay} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition shadow-lg shadow-cyan-500/20">
            {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 text-white pl-0.5"/>}
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">FPS:</span>
            <input type="range" min="1" max="30" value={fps} onChange={(e) => setFps(e.target.value)} className="w-24 accent-cyan-500" />
            <span className="text-xs font-mono text-cyan-400 w-6">{fps}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button onClick={duplicateFrame} className="flex items-center px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700">
            <Copy className="w-4 h-4 mr-1.5" /> Duplicate
          </button>
          <button onClick={addFrame} className="flex items-center px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700">
            <Plus className="w-4 h-4 mr-1.5" /> New Frame
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center space-x-3 overflow-x-auto pb-2 custom-scrollbar">
        {frames.map((frame, i) => (
          <div
            key={i} onClick={() => !isPlaying && setCurrentFrameIdx(i)}
            className={`relative flex-shrink-0 w-32 h-16 bg-black border-2 rounded cursor-pointer transition-all ${currentFrameIdx === i ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-slate-700 hover:border-slate-500'}`}
          >
            {frame && <img src={frame} alt={`Frame ${i}`} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />}
            <div className="absolute top-1 left-1 bg-black/60 text-[10px] px-1 rounded font-mono">{i + 1}</div>

            {!isPlaying && frames.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteFrame(i); }}
                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
