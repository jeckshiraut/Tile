import React, { useState } from 'react';
import { Type, Image, Youtube, Github } from 'lucide-react';
import UnicodeStyler from './components/UnicodeStyler';
import ImageStyler from './components/ImageStyler';
import AiAssistant from './components/AiAssistant';

enum Tab {
  UNICODE = 'UNICODE',
  IMAGE = 'IMAGE'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.UNICODE);
  const [globalText, setGlobalText] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yt-red selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-yt-hover">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yt-red rounded-lg flex items-center justify-center text-white">
               <Youtube size={20} fill="white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">YT <span className="text-yt-red">Creator Studio</span></h1>
          </div>
          
          <nav className="flex gap-2 bg-yt-dark p-1 rounded-lg border border-yt-hover">
            <button 
              onClick={() => setActiveTab(Tab.UNICODE)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === Tab.UNICODE ? 'bg-yt-light text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Type size={16} />
              <span className="hidden sm:inline">Text Styler</span>
            </button>
            <button 
              onClick={() => setActiveTab(Tab.IMAGE)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === Tab.IMAGE ? 'bg-yt-light text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Image size={16} />
              <span className="hidden sm:inline">Image Creator</span>
            </button>
          </nav>

          <button 
             onClick={() => setIsAiOpen(!isAiOpen)}
             className={`p-2 rounded-lg border transition-all ${isAiOpen ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-yt-hover text-gray-400 hover:text-white'}`}
          >
             <span className="font-bold text-sm">AI Tools</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto flex gap-6 relative">
        
        {/* Left/Center Content */}
        <div className={`flex-1 transition-all duration-300 ${isAiOpen ? 'mr-0 lg:mr-80' : ''}`}>
           {/* Header for Section */}
           <div className="mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                {activeTab === Tab.UNICODE 
                  ? <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Stand Out in Comments</span> 
                  : <span className="bg-clip-text text-transparent bg-gradient-to-r from-yt-red to-orange-500">Create Colorful Posts</span>
                }
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                {activeTab === Tab.UNICODE 
                  ? "Generate stylish Unicode text compatible with YouTube descriptions, titles, and comments." 
                  : "Design vibrant, colorful text images for your Community Tab, Thumbnails, or Video Overlays."
                }
              </p>
           </div>

           {activeTab === Tab.UNICODE ? (
             <UnicodeStyler 
                inputText={globalText} 
                onInputChange={setGlobalText} 
             />
           ) : (
             <ImageStyler 
                initialText={globalText} 
             />
           )}
        </div>

        {/* Right Sidebar (AI) */}
        <aside 
            className={`fixed right-0 top-16 bottom-0 w-80 bg-black border-l border-yt-hover transform transition-transform duration-300 z-40 ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <AiAssistant onApply={(text) => setGlobalText(text)} />
        </aside>

      </main>

       {/* Overlay for mobile when AI is open */}
       {isAiOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsAiOpen(false)}
        />
       )}

      {/* Footer */}
      <footer className="border-t border-yt-hover mt-12 py-8 bg-black">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} YT Creator Tools. Not affiliated with YouTube.</p>
            <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Github size={16} /> GitHub
                </a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;