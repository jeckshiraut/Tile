import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { generateSuggestions } from '../services/geminiService';

interface AiAssistantProps {
  onApply: (text: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onApply }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'rewrite' | 'title' | 'desc' | 'tags'>('rewrite');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await generateSuggestions(prompt, mode);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="bg-yt-dark rounded-xl border border-yt-hover overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-yt-hover bg-gradient-to-r from-yt-dark to-black">
        <h3 className="text-lg font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            <Sparkles size={18} className="text-blue-400" />
            AI Assistant
        </h3>
        <p className="text-xs text-gray-400 mt-1">Powered by Gemini 3 Flash</p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-2">
            {[
                {id: 'rewrite', label: 'Rewrite Style'},
                {id: 'title', label: 'Gen. Title'},
                {id: 'desc', label: 'Gen. Desc'},
                {id: 'tags', label: 'Gen. Tags'}
            ].map(m => (
                <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`text-xs py-2 px-1 rounded border transition-all ${
                        mode === m.id 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'border-yt-hover text-gray-400 hover:bg-yt-hover'
                    }`}
                >
                    {m.label}
                </button>
            ))}
        </div>

        <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
                mode === 'rewrite' ? "Paste your comment/post here to make it fun..." :
                mode === 'title' ? "What is your video about?" :
                mode === 'desc' ? "Describe your video topic..." :
                "Enter video keywords..."
            }
            className="w-full bg-black border border-yt-gray rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none resize-none h-24"
        />

        <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Generate
        </button>

        {result && (
            <div className="mt-4 p-3 bg-black/50 rounded-lg border border-yt-hover animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                        <Bot size={12} /> Gemini Output
                    </span>
                </div>
                <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {result}
                </div>
                <div className="mt-3 pt-3 border-t border-yt-hover flex justify-end">
                    <button 
                        onClick={() => onApply(result)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Use this text
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;