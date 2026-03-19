import React from 'react';
import { ChevronRight, Check, Copy } from 'lucide-react';

const CodePreview = ({ generatedCode, language, onCopy, copied }) => {
  if (!generatedCode) return null;
  return (
    <aside className="w-full lg:w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <h2 className="text-sm font-bold flex items-center">
          <ChevronRight className="w-4 h-4 text-cyan-400 mr-1"/> Generated {language === 'cpp' ? 'Arduino Sketch' : 'MicroPython Script'}
        </h2>
        <button onClick={onCopy} className="text-xs flex items-center bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition">
          {copied ? <Check className="w-3 h-3 text-green-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </aside>
  );
};

export default CodePreview;
