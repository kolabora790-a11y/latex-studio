import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileText, 
  Download, 
  Play, 
  Settings, 
  Eye, 
  Code2, 
  Layers, 
  ChevronRight,
  Loader2,
  Trash2,
  FilePlus,
  Github,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// TEMPLATES
const TEMPLATES = {
  article: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{My LaTeX Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Welcome to the modern LaTeX editor. You can write your formulas here:
\\begin{equation}
    E = mc^2
\\end{equation}

\\section{Features}
\\begin{itemize}
    \\item Live Editing
    \\item PDF Generation
    \\item Premium Design
\\end{itemize}

\\end{document}`,
  resume: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}

\\begin{document}
\\begin{center}
    {\\huge \\textbf{JOHN DOE}} \\\\
    Email: john.doe@example.com | Phone: (123) 456-7890 \\\\
    Location: New York, NY
\\end{center}

\\section*{Experience}
\\textbf{Senior Developer} | Tech Corp \\hfill 2020 -- Present \\\\
- Led development of core LaTeX rendering engine.

\\section*{Education}
\\textbf{B.S. Computer Science} | University of Technology \\hfill 2016 -- 2020

\\end{document}`,
  homework: `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}
\\title{Homework Assignment 1}
\\author{Mathematics 101}
\\maketitle

\\section*{Problem 1}
Solve for $x$:
\\begin{equation*}
    3x + 5 = 11
\\end{equation*}

\\textbf{Solution:}
Subtract 5 from both sides:
\\begin{equation*}
    3x = 6
\\end{equation*}
Divide by 3:
\\begin{equation*}
    x = 2
\\end{equation*}

\\end{document}`
};

function App() {
  const [code, setCode] = useState(TEMPLATES.article);
  const [isCompiling, setIsCompiling] = useState(false);
  const [view, setView] = useState('split');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hasCompiled, setHasCompiled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const formRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && view !== 'split') setView('split');
      if (mobile && view === 'split') setView('editor');
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  const handleCompile = () => {
    setIsCompiling(true);
    setHasCompiled(true);
    // Give it a tiny bit of time for state to propagate to the hidden input
    setTimeout(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, 50);
  };

  const handleDownload = () => {
    const url = `https://latexonline.cc/compile?text=${encodeURIComponent(code)}`;
    window.open(url, '_blank');
  };

  const handleChangeTemplate = (type) => {
    if (confirm('Load ' + type + ' template? Current work will be replaced.')) {
      setCode(TEMPLATES[type]);
      setHasCompiled(false);
      setShowMobileMenu(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Hidden compilation form - using GET to ensure maximum compatibility with the target server */}
      <form 
        ref={formRef} 
        action="https://latexonline.cc/compile" 
        method="GET" 
        target="pdf-preview" 
        style={{ display: 'none' }}
      >
        <input type="hidden" name="text" value={code} />
      </form>

      <header className="main-header glass-morphism">
        <div className="controls-group">
          <button 
            onClick={() => isMobile && setShowMobileMenu(!showMobileMenu)} 
            className="btn btn-secondary" 
            style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.3)' }}
          >
            <Layers style={{ width: '20px', height: '20px', color: '#818cf8' }} />
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: isMobile ? 'none' : 'block' }}>
            LaTeX<span style={{ color: '#818cf8' }}>Studio</span>
          </h1>
        </div>

        <div className="controls-group">
          {/* Desktop Templates */}
          <div className="template-selector" style={{ display: isMobile ? 'none' : 'flex' }}>
            {Object.keys(TEMPLATES).map(t => (
                <button key={t} onClick={() => handleChangeTemplate(t)} className="template-btn">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
          </div>

          <button onClick={handleCompile} disabled={isCompiling} className="btn btn-primary">
            {isCompiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isMobile ? '' : 'Compile'}</span>
          </button>
          
          <button onClick={handleDownload} className="btn btn-secondary">
            <Download className="w-4 h-4" />
            <span style={{ display: isMobile ? 'none' : 'inline' }}>Download</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-morphism"
            style={{ position: 'absolute', top: '70px', left: '20px', right: '20px', zIndex: 100, borderRadius: '16px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#818cf8' }}>SELECT TEMPLATE</span>
                <X style={{ width: '16px', height: '16px', cursor: 'pointer' }} onClick={() => setShowMobileMenu(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(TEMPLATES).map(t => (
                    <button 
                        key={t} 
                        onClick={() => handleChangeTemplate(t)} 
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        <FilePlus className="w-4 h-4" /> {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-container">
        <div className={`editor-pane ${isMobile && view === 'preview' ? 'hidden' : ''}`}>
             <div className="pane-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 style={{ width: '12px', height: '12px' }} /> MAIN.TEX
                </div>
                {isMobile && (
                  <button onClick={() => setView('preview')} style={{ color: '#818cf8', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.7rem' }}>
                    VIEW PDF <ChevronRight style={{ width: '12px', height: '12px', verticalAlign: 'middle' }} />
                  </button>
                )}
             </div>
             <div style={{ flex: 1 }}>
                <Editor
                    key={hasCompiled ? 'compiled' : 'initial'}
                    height="100%"
                    defaultLanguage="latex"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v)}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        fontFamily: 'JetBrains Mono, monospace',
                        wordWrap: 'on'
                    }}
                />
             </div>
        </div>

        <div className={`preview-pane ${isMobile && view === 'editor' ? 'hidden' : ''}`}>
          <div className="preview-header" style={{ justifyContent: 'space-between' }}>
            <span>Compiled Output</span>
            {isMobile && (
              <button onClick={() => setView('editor')} style={{ color: '#818cf8', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.7rem' }}>
                BACK TO CODE
              </button>
            )}
          </div>
          
          <div className="preview-content">
            <iframe 
                name="pdf-preview"
                className="pdf-iframe"
                style={{ display: hasCompiled ? 'block' : 'none' }}
                title="PDF Preview"
                onLoad={() => {
                   setIsCompiling(false);
                   // On desktop, we don't need to switch view, on mobile we already do in handleCompile or here
                }}
            />
            
            {(!hasCompiled || isCompiling) && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
                <div style={{ padding: '24px', borderRadius: '50%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {isCompiling ? <Loader2 className="w-12 h-12 animate-spin text-indigo-400" /> : <Eye style={{ width: '48px', height: '48px', opacity: 0.2 }} />}
                </div>
                <p style={{ fontSize: '0.875rem' }}>{isCompiling ? 'Rendering Document...' : 'Ready to render'}</p>
                {!isCompiling && <button onClick={handleCompile} className="btn btn-primary">Compile PDF Now</button>}
              </div>
            )}
          </div>

          {isMobile && view === 'preview' && (
            <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10 }}>
               <button onClick={handleCompile} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#4f46e5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {isCompiling ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Play className="w-6 h-6 text-white" style={{ fill: 'white' }} />}
               </button>
            </div>
          )}
        </div>
      </main>

      <footer className="main-footer">
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>LaTeX Engine: TeX Live 2023</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>UTF-8 Encoding</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
           <Github style={{ width: '12px', height: '12px' }} /> Antigravity.io
        </div>
      </footer>
    </div>
  );
}

export default App;
