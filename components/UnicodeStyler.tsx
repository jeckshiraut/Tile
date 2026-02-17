import React, { useState } from 'react';
import { Copy, Check, Type, Sparkles, Palette, Info } from 'lucide-react';
import { FONT_STYLES, convertText } from '../utils/mappings';

interface UnicodeStylerProps {
  inputText: string;
  onInputChange: (text: string) => void;
}

const PRESET_COLORS = [
  '#FFFFFF', // White
  '#3ea6ff', // YT Blue
  '#FF0000', // YT Red
  '#2ba640', // Green
  '#f1c40f', // Yellow
  '#9b59b6', // Purple
  '#e67e22', // Orange
];

const UnicodeStyler: React.FC<UnicodeStylerProps> = ({ inputText, onInputChange }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');

  const handleCopy = async (text: string, id: string) => {
    try {
      if (textColor !== '#FFFFFF') {
        // Rich copy for colored text (works in Word, Docs, etc., but not YT comments)
        const html = `<span style="color: ${textColor};">${text}</span>`;
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([text], { type: 'text/plain' });
        
        // This API requires HTTPS or localhost
        if (navigator.clipboard && navigator.clipboard.write) {
             await navigator.clipboard.write([
                new ClipboardItem({
                    'text/plain': blobText,
                    'text/html': blobHtml,
                })
            ]);
        } else {
            // Fallback for older browsers
             await navigator.clipboard.writeText(text);
        }
      } else {
        await navigator.clipboard.writeText(text);
      }
      
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Rich copy failed, falling back to text", error);
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="bg-yt-dark p-6 rounded-xl border border-yt-hover shadow-lg">
        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
          <Type size={16} />
          Input Text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type something here to stylize..."
          className="w-full bg-black text-white p-4 rounded-lg border border-yt-gray focus:border-yt-red focus:ring-1 focus:ring-yt-red outline-none resize-none h-32 text-lg transition-all"
        />
        <p className="text-xs text-gray-500 mt-2">
          These "fonts" are actually Unicode characters. They work in YouTube titles, descriptions, and comments!
        </p>
      </div>

      {/* Color Picker Section */}
      <div className="bg-yt-dark p-4 rounded-xl border border-yt-hover flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-lg border border-yt-hover">
                <Palette size={20} className="text-yt-red" />
            </div>
            <div>
                <label className="text-sm font-bold text-white block">Preview Color</label>
                <p className="text-xs text-gray-400">Customize how the text looks in this app</p>
            </div>
         </div>

         <div className="flex items-center gap-3 flex-wrap">
             <div className="flex gap-1 bg-black p-1 rounded-lg border border-yt-gray">
                {PRESET_COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => setTextColor(c)}
                        className={`w-6 h-6 rounded-md transition-all ${textColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select color ${c}`}
                    />
                ))}
             </div>
             <div className="h-8 w-[1px] bg-yt-gray mx-1 hidden sm:block"></div>
             <div className="relative group flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono hidden sm:block">{textColor}</span>
                <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                />
             </div>
         </div>
      </div>
      
      {/* Warning/Info for color */}
      {textColor !== '#FFFFFF' && (
        <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-800 p-3 rounded-lg text-blue-200 text-xs animate-fade-in">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>
                <strong>Note:</strong> The color is for preview only. YouTube does not support custom text colors in comments or descriptions (plain text only).
                <br/>
                <span className="opacity-80">However, we will copy the color code so it works in apps that support Rich Text (like Word, Email, etc).</span>
            </p>
        </div>
      )}

      {/* Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FONT_STYLES.map((style) => {
          const converted = convertText(inputText || "Preview Text", style.map);
          return (
            <div 
              key={style.id} 
              className="bg-yt-dark p-4 rounded-lg border border-yt-hover hover:border-gray-500 transition-colors group relative flex flex-col gap-2"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{style.name}</span>
                <button
                  onClick={() => handleCopy(converted, style.id)}
                  className={`p-2 rounded-full transition-all ${
                    copiedId === style.id ? 'bg-green-500/20 text-green-500' : 'bg-yt-hover text-gray-300 hover:text-white hover:bg-yt-gray'
                  }`}
                  aria-label="Copy to clipboard"
                >
                  {copiedId === style.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              <div 
                className="text-xl break-words min-h-[3rem] flex items-center transition-colors duration-200"
                style={{ color: textColor }}
              >
                {converted}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnicodeStyler;