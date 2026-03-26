/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { ResumeData, OptimizationProposal, ApiConfig, PromptSettings } from './types';
import { parseResume, optimizeResume } from './services/ai';
import { ControlPanel } from './components/ControlPanel';
import { ResumePreview } from './components/ResumePreview';
import { Button } from './components/ui/button';
import { Download, Settings, FileText, FileJson, File, Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Language, LANGUAGES, t } from './i18n';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [proposals, setProposals] = useState<OptimizationProposal[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [themeColor, setThemeColor] = useState('#18181b');
  const [lineSpacing, setLineSpacing] = useState<'tight' | 'snug' | 'normal' | 'relaxed'>('normal');
  const [twoColumn, setTwoColumn] = useState({ education: false, honors: false });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('RESUME_API_CONFIG_V3');
    if (saved) {
      try { 
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      baseUrl: '',
      apiKey: '',
      model: 'gemini-3.1-pro-preview'
    };
  });

  const [promptSettings, setPromptSettings] = useState<PromptSettings>({
    preset: 'standard',
    textVolume: 'normal',
    tweakProjectNames: false,
    fabricationLevel: 0.5,
    addRelevantExperiences: false,
    customInstructions: ''
  });

  const resumeRef = useRef<HTMLDivElement>(null);

  const handleSaveApiConfig = (config: ApiConfig) => {
    setApiConfig(config);
    localStorage.setItem('RESUME_API_CONFIG_V3', JSON.stringify(config));
  };

  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = async () => {
    if (!resumeRef.current || !resumeData) return;
    
    setIsExporting(true);
    try {
      const widthPx = resumeRef.current.offsetWidth;
      const heightPx = resumeRef.current.offsetHeight;

      // html-to-image uses SVG foreignObject, which supports modern CSS like oklch
      const dataUrl = await toPng(resumeRef.current, { 
        quality: 1.0, 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: widthPx,
        height: heightPx
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [widthPx, heightPx]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, widthPx, heightPx);
      pdf.save(`${resumeData.personalInfo?.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert(t(language, 'error.pdf'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    if (!resumeData) return;
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo?.name || 'resume'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWord = () => {
    if (!resumeRef.current || !resumeData) return;
    const htmlContent = resumeRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + htmlContent + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${resumeData.personalInfo?.name || 'resume'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleParse = async (rawText: string) => {
    if (!apiConfig.apiKey) {
      alert(t(language, 'api.error'));
      return false;
    }
    setIsParsing(true);
    try {
      const data = await parseResume(rawText, apiConfig, language);
      setResumeData(data);
      setProposals([]);
      return true;
    } catch (error: any) {
      console.error("Failed to parse resume", error);
      alert(`${t(language, 'error.parse')}${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsParsing(false);
    }
  };

  const handleOptimize = async (jd: string) => {
    if (!resumeData) return false;
    if (!apiConfig.apiKey) {
      alert(t(language, 'api.error'));
      return false;
    }
    setIsOptimizing(true);
    try {
      const newProposals = await optimizeResume(resumeData, jd, apiConfig, promptSettings, language);
      setProposals(newProposals);
      return true;
    } catch (error: any) {
      console.error("Failed to optimize resume", error);
      alert(`${t(language, 'error.optimize')}${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAcceptProposal = (moduleId: string) => {
    setProposals(prev => prev.map(p => p.moduleId === moduleId ? { ...p, status: 'accepted' } : p));
    
    // Update resume data
    const proposal = proposals.find(p => p.moduleId === moduleId);
    if (!proposal || !resumeData) return;

    setResumeData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        workExperience: prev.workExperience.map(w => w.id === moduleId ? { 
          ...w, 
          description: proposal.optimizedText,
          ...(proposal.optimizedName ? { position: proposal.optimizedName } : {})
        } : w),
        projectExperience: prev.projectExperience.map(p => p.id === moduleId ? { 
          ...p, 
          description: proposal.optimizedText,
          ...(proposal.optimizedName ? { name: proposal.optimizedName } : {})
        } : p)
      };
    });
  };

  const handleRejectProposal = (moduleId: string) => {
    setProposals(prev => prev.map(p => p.moduleId === moduleId ? { ...p, status: 'rejected' } : p));
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans print:h-auto print:bg-white">
      {/* Left Panel: Controls */}
      <div className="w-1/3 min-w-[400px] max-w-[500px] border-r border-zinc-200 bg-white flex flex-col shadow-sm z-10 print:hidden">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold tracking-tight">AI Resume Builder</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-zinc-500 absolute left-2 pointer-events-none" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="h-8 pl-7 pr-2 rounded-md border border-zinc-200 bg-transparent text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 appearance-none cursor-pointer hover:bg-zinc-50"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">{t(language, 'api.settings')}</h4>
                  <p className="text-xs text-zinc-500">
                    {t(language, 'api.settings.desc')}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-zinc-700">{t(language, 'api.baseUrl')}</label>
                      <input
                        type="text"
                        value={apiConfig.baseUrl}
                        onChange={(e) => handleSaveApiConfig({...apiConfig, baseUrl: e.target.value})}
                        className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700">{t(language, 'api.apiKey')}</label>
                      <input
                        type="password"
                        value={apiConfig.apiKey}
                        onChange={(e) => handleSaveApiConfig({...apiConfig, apiKey: e.target.value})}
                        className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700">{t(language, 'api.model')}</label>
                      <input
                        type="text"
                        value={apiConfig.model}
                        onChange={(e) => handleSaveApiConfig({...apiConfig, model: e.target.value})}
                        className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 h-8 text-xs"
                      onClick={() => handleSaveApiConfig({ baseUrl: '', apiKey: '', model: 'gemini-3.1-pro-preview' })}
                    >
                      {t(language, 'api.reset')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button disabled={!resumeData || isExporting} size="sm" variant="outline" className="gap-2 h-8">
                  <Download className="w-4 h-4" />
                  {isExporting ? t(language, 'export.exporting') : t(language, 'export.button')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="end">
                <div className="flex flex-col">
                  <Button onClick={handlePrint} variant="ghost" className="justify-start gap-2 h-9 px-2 text-sm font-normal">
                    <FileText className="w-4 h-4 text-zinc-500" /> {t(language, 'export.download.pdf')}
                  </Button>
                  <Button onClick={handleExportWord} variant="ghost" className="justify-start gap-2 h-9 px-2 text-sm font-normal">
                    <File className="w-4 h-4 text-zinc-500" /> {t(language, 'export.download.word')}
                  </Button>
                  <Button onClick={handleExportJSON} variant="ghost" className="justify-start gap-2 h-9 px-2 text-sm font-normal">
                    <FileJson className="w-4 h-4 text-zinc-500" /> {t(language, 'export.download.json')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ControlPanel 
            onParse={handleParse} 
            onOptimize={handleOptimize}
            isParsing={isParsing}
            isOptimizing={isOptimizing}
            hasResume={!!resumeData}
            proposals={proposals}
            onAccept={handleAcceptProposal}
            onReject={handleRejectProposal}
            themeColor={themeColor}
            onThemeChange={setThemeColor}
            lineSpacing={lineSpacing}
            onLineSpacingChange={setLineSpacing}
            twoColumn={twoColumn}
            onTwoColumnChange={setTwoColumn}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            promptSettings={promptSettings}
            onPromptSettingsChange={setPromptSettings}
            language={language}
          />
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 overflow-y-auto bg-zinc-100 p-8 flex justify-center items-start print:p-0 print:overflow-visible print:bg-white">
        <div className="shadow-xl bg-white print:shadow-none print:w-full" style={{ width: '210mm', minHeight: '297mm' }}>
          <div ref={resumeRef} className="w-full h-full bg-white print:w-full">
            <ResumePreview 
              data={resumeData} 
              proposals={proposals}
              onAccept={handleAcceptProposal}
              onReject={handleRejectProposal}
              themeColor={themeColor}
              lineSpacing={lineSpacing}
              twoColumn={twoColumn}
              avatarUrl={avatarUrl}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

