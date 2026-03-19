import React from 'react';
import { Monitor, Code } from 'lucide-react';

const Header = ({ onLoadExample, onGenerate }) => (
  <header className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg">
    <div className="flex items-center space-x-3">
      <Monitor className="text-cyan-400 w-6 h-6" />
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        OLED Face Designer
      </h1>
    </div>
    <div className="flex items-center space-x-4 text-sm">
      <button onClick={() => onLoadExample('smiley')} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition">
        Load Example
      </button>
      <button onClick={onGenerate} className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center transition shadow-cyan-500/20 shadow-lg">
        <Code className="w-4 h-4 mr-2" /> Generate Code
      </button>
    </div>
  </header>
);

export default Header;
