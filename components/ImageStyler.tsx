import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Palette, Image as ImageIcon, Layout, Move } from 'lucide-react';

interface ImageStylerProps {
  initialText: string;
}

const GRADIENTS = [
  { name: 'Sunset', stops: ['#FF512F', '#DD2476'] },
  { name: 'Ocean', stops: ['#2193b0', '#6dd5ed'] },
  { name: 'Lime', stops: ['#Dce35b', '#45b649'] },
  { name: 'YouTube', stops: ['#e52d27', '#b31217'] },
  { name: 'Neon', stops: ['#f093fb', '#f5576c'] },
  { name: 'Gold', stops: ['#CAC531', '#F3F9A7'] },
  { name: 'Dark', stops: ['#232526', '#414345'] },
  { name: 'White', stops: ['#FFFFFF', '#ECE9E6'] },
  // New Colors
  { name: 'Plasma', stops: ['#ef32d9', '#89fffd'] },
  { name: 'Midnight', stops: ['#141E30', '#243B55'] },
  { name: 'Blueberry', stops: ['#0052D4', '#65C7F7'] },
  { name: 'Candy', stops: ['#DA4453', '#89216B'] },
  { name: 'Solid Red', stops: ['#FF0000', '#FF0000'] },
  { name: 'Solid Blue', stops: ['#0000FF', '#0000FF'] },
  { name: 'Solid Yellow', stops: ['#FFD700', '#FFD700'] },
];

const FONTS = [
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Impact', family: 'Impact, sans-serif' },
  { name: 'Courier', family: 'Courier New, monospace' },
  { name: 'Cursive', family: 'cursive' },
];

const ImageStyler: React.FC<ImageStylerProps> = ({ initialText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState(initialText || "HELLO WORLD");
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [bgColor, setBgColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(80);
  const [fontFamily, setFontFamily] = useState(FONTS[2].family); // Default Impact
  const [strokeColor, setStrokeColor] = useState('#FFFFFF');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9'>('16:9');

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set Dimensions
    const width = 1280;
    const height = aspectRatio === '16:9' ? 720 : 1280;
    canvas.width = width;
    canvas.height = height;

    // Draw Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Font Configuration
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = width / 2;
    const y = height / 2;

    // Shadow
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowBlur > 0 ? 5 : 0;
    ctx.shadowOffsetY = shadowBlur > 0 ? 5 : 0;

    // Create Text Gradient
    const textWidth = ctx.measureText(text).width;
    const gradientFill = ctx.createLinearGradient(x - textWidth / 2, y - fontSize / 2, x + textWidth / 2, y + fontSize / 2);
    gradientFill.addColorStop(0, gradient.stops[0]);
    gradientFill.addColorStop(1, gradient.stops[1]);

    // Draw Stroke
    if (strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(text, x, y);
    }
    
    // Draw Fill
    ctx.fillStyle = gradientFill;
    ctx.fillText(text, x, y);

  }, [text, gradient, bgColor, fontSize, fontFamily, strokeColor, strokeWidth, shadowBlur, shadowColor, aspectRatio]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `yt-styled-text-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6 bg-yt-dark p-6 rounded-xl border border-yt-hover h-fit overflow-y-auto max-h-[80vh] custom-scrollbar">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <Palette className="text-yt-red" />
            Style Editor
        </h3>

        {/* Text Input */}
        <div>
            <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Text Content</label>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-black border border-yt-gray rounded p-2 text-white focus:border-yt-red outline-none"
            />
        </div>

        {/* Font Family */}
        <div>
            <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Font</label>
            <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-black border border-yt-gray rounded p-2 text-white outline-none"
            >
                {FONTS.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
            </select>
        </div>

         {/* Gradient Picker */}
         <div>
            <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Text Color (Gradient)</label>
            <div className="grid grid-cols-4 gap-2">
                {GRADIENTS.map((g) => (
                    <button
                        key={g.name}
                        onClick={() => setGradient(g)}
                        className={`w-full h-8 rounded-md transition-transform hover:scale-105 border ${gradient.name === g.name ? 'border-white' : 'border-transparent'}`}
                        style={{ background: `linear-gradient(135deg, ${g.stops[0]}, ${g.stops[1]})` }}
                        title={g.name}
                    />
                ))}
            </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
            <div>
                <label className="flex justify-between text-xs text-gray-400 uppercase font-bold mb-1">
                    <span>Size</span>
                    <span>{fontSize}px</span>
                </label>
                <input 
                    type="range" min="20" max="200" value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-yt-red h-2 bg-yt-gray rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="flex justify-between text-xs text-gray-400 uppercase font-bold mb-1">
                    <span>Stroke Width</span>
                    <span>{strokeWidth}px</span>
                </label>
                <input 
                    type="range" min="0" max="20" value={strokeWidth} 
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full accent-yt-red h-2 bg-yt-gray rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="flex justify-between text-xs text-gray-400 uppercase font-bold mb-1">
                    <span>Shadow</span>
                    <span>{shadowBlur}px</span>
                </label>
                <input 
                    type="range" min="0" max="50" value={shadowBlur} 
                    onChange={(e) => setShadowBlur(Number(e.target.value))}
                    className="w-full accent-yt-red h-2 bg-yt-gray rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>

        {/* Colors (BG/Stroke) */}
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Background</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono">{bgColor}</span>
                </div>
            </div>
            <div>
                <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Stroke</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={strokeColor} 
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono">{strokeColor}</span>
                </div>
            </div>
        </div>

        {/* Aspect Ratio */}
        <div>
             <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Aspect Ratio</label>
             <div className="flex bg-black rounded-lg p-1 border border-yt-gray">
                <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 text-sm py-1 rounded ${aspectRatio === '16:9' ? 'bg-yt-hover text-white' : 'text-gray-400'}`}
                >
                    16:9 (Thumbnail)
                </button>
                <button 
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex-1 text-sm py-1 rounded ${aspectRatio === '1:1' ? 'bg-yt-hover text-white' : 'text-gray-400'}`}
                >
                    1:1 (Post)
                </button>
             </div>
        </div>

      </div>

      {/* Preview */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-black rounded-xl border border-yt-hover p-4 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
             {/* Checkerboard pattern for transparency indication */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>
            
            <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto shadow-2xl rounded-sm"
                style={{ maxHeight: '600px' }}
            />
            
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                    Right Click to Save or use Download button
                </span>
            </div>
        </div>

        <button 
            onClick={handleDownload}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
            <Download size={20} />
            Download Image
        </button>

        <div className="bg-yt-dark p-4 rounded-lg border border-yt-gray/30 text-sm text-gray-400">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                <ImageIcon size={16} /> 
                Usage Tip
            </h4>
            <p>
                Colors are not supported in YouTube comments text directly. Use this tool to create 
                <strong> Community Posts</strong>, <strong>Video Thumbnails</strong>, or <strong>Video Overlays</strong> 
                that stand out.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ImageStyler;