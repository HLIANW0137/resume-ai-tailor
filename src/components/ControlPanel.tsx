import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { OptimizationProposal } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Check, X, Sparkles, FileText, Briefcase, Palette, Layout, Upload, Columns } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlPanelProps {
  onParse: (text: string) => Promise<boolean>;
  onOptimize: (jd: string) => Promise<boolean>;
  isParsing: boolean;
  isOptimizing: boolean;
  hasResume: boolean;
  proposals: OptimizationProposal[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  themeColor: string;
  onThemeChange: (color: string) => void;
  lineSpacing: 'tight' | 'snug' | 'normal' | 'relaxed';
  onLineSpacingChange: (spacing: 'tight' | 'snug' | 'normal' | 'relaxed') => void;
  twoColumn: { education: boolean; honors: boolean };
  onTwoColumnChange: (twoColumn: { education: boolean; honors: boolean }) => void;
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export function ControlPanel({
  onParse,
  onOptimize,
  isParsing,
  isOptimizing,
  hasResume,
  proposals,
  onAccept,
  onReject,
  themeColor,
  onThemeChange,
  lineSpacing,
  onLineSpacingChange,
  twoColumn,
  onTwoColumnChange,
  avatarUrl,
  onAvatarChange
}: ControlPanelProps) {
  const [rawText, setRawText] = useState('');
  const [jd, setJd] = useState('');
  const [activeTab, setActiveTab] = useState('parse');

  const pendingProposals = proposals.filter(p => p.status === 'pending');

  return (
    <div className="p-4 h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="parse" className="flex gap-2 items-center"><FileText className="w-4 h-4"/> 1. Parse</TabsTrigger>
          <TabsTrigger value="optimize" disabled={!hasResume} className="flex gap-2 items-center"><Briefcase className="w-4 h-4"/> 2. Optimize</TabsTrigger>
          <TabsTrigger value="review" disabled={proposals.length === 0} className="flex gap-2 items-center">
            <Sparkles className="w-4 h-4"/> 3. Review
            {pendingProposals.length > 0 && (
              <span className="ml-1 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingProposals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="style" disabled={!hasResume} className="flex gap-2 items-center"><Palette className="w-4 h-4"/> 4. Style</TabsTrigger>
        </TabsList>

        <TabsContent value="parse" className="flex-1 flex flex-col gap-4 mt-0 data-[state=inactive]:hidden">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Paste Raw Resume Text</label>
            <Textarea 
              className="flex-1 resize-none font-mono text-xs" 
              placeholder="Paste your unformatted resume text here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>
          <Button 
            onClick={async () => {
              const success = await onParse(rawText);
              if (success) setActiveTab('optimize');
            }} 
            disabled={!rawText.trim() || isParsing}
            className="w-full"
          >
            {isParsing ? "Parsing..." : "Generate Resume"}
          </Button>
        </TabsContent>

        <TabsContent value="optimize" className="flex-1 flex flex-col gap-4 mt-0 data-[state=inactive]:hidden">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Target Job Description (JD)</label>
            <Textarea 
              className="flex-1 resize-none text-sm" 
              placeholder="Paste the job description here. AI will tailor your experience to match the keywords and requirements..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>
          <Button 
            onClick={async () => {
              const success = await onOptimize(jd);
              if (success) setActiveTab('review');
            }} 
            disabled={!jd.trim() || isOptimizing}
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isOptimizing ? "Optimizing..." : "AI Smart Optimize"}
          </Button>
        </TabsContent>

        <TabsContent value="review" className="flex-1 flex flex-col gap-4 mt-0 overflow-y-auto data-[state=inactive]:hidden">
          {proposals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              No optimizations generated yet.
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {proposals.map((proposal) => (
                <Card key={proposal.moduleId} className={proposal.status !== 'pending' ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      AI Suggestion
                    </CardTitle>
                    <CardDescription className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100 mt-2">
                      {proposal.reasoning}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-3">
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Original</div>
                      <div className="text-xs text-zinc-600 line-through decoration-red-300 bg-red-50/50 p-2 rounded border border-red-100">
                        {proposal.originalText}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Optimized</div>
                      <div className="text-xs text-zinc-900 bg-green-50/50 p-2 rounded border border-green-100">
                        {proposal.optimizedText}
                      </div>
                    </div>
                  </CardContent>
                  {proposal.status === 'pending' && (
                    <CardFooter className="flex gap-2 pt-0">
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onReject(proposal.moduleId)}>
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => onAccept(proposal.moduleId)}>
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                    </CardFooter>
                  )}
                  {proposal.status !== 'pending' && (
                    <CardFooter className="pt-0">
                      <div className="text-xs font-medium text-zinc-500 w-full text-center py-1 bg-zinc-50 rounded-md">
                        {proposal.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="style" className="flex-1 flex flex-col gap-6 mt-0 data-[state=inactive]:hidden overflow-y-auto pb-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><Palette className="w-4 h-4"/> Theme Color</label>
            <div className="flex gap-3 items-center">
              {['#18181b', '#1e3a8a', '#064e3b', '#4c1d95'].map(color => (
                <button
                  key={color}
                  onClick={() => onThemeChange(color)}
                  style={{ backgroundColor: color }}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    themeColor === color ? "ring-2 ring-offset-1 ring-zinc-400 scale-110" : "border-transparent hover:scale-105"
                  )}
                />
              ))}
              <div className="w-px h-6 bg-zinc-200 mx-1" />
              <input 
                type="color" 
                value={themeColor} 
                onChange={(e) => onThemeChange(e.target.value)} 
                className="w-7 h-7 p-0 border-0 rounded cursor-pointer"
                title="Custom Color"
              />
            </div>
            <p className="text-xs text-zinc-500">Theme color applies to section headings and titles.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><Layout className="w-4 h-4"/> Line Spacing</label>
            <div className="flex gap-2">
              {(['tight', 'snug', 'normal', 'relaxed'] as const).map(space => (
                <Button 
                  key={space}
                  variant={lineSpacing === space ? "default" : "outline"} 
                  onClick={() => onLineSpacingChange(space)} 
                  className="flex-1 capitalize text-xs px-2"
                >
                  {space}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">Adjust spacing to compress or expand resume length.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><Columns className="w-4 h-4"/> Two-Column Layout</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={twoColumn.education} 
                  onChange={(e) => onTwoColumnChange({...twoColumn, education: e.target.checked})} 
                  className="rounded border-zinc-300"
                />
                Education
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={twoColumn.honors} 
                  onChange={(e) => onTwoColumnChange({...twoColumn, honors: e.target.checked})} 
                  className="rounded border-zinc-300"
                />
                Honors & Awards
              </label>
            </div>
            <p className="text-xs text-zinc-500">Use two columns for specific sections to save space.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><Upload className="w-4 h-4"/> Avatar (Optional)</label>
            <div className="flex items-center gap-4">
              {avatarUrl && (
                <img src={avatarUrl} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-zinc-200" />
              )}
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="avatar-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onAvatarChange(URL.createObjectURL(file));
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()} className="flex-1">
                    Upload Photo
                  </Button>
                  {avatarUrl && (
                    <Button variant="ghost" size="sm" onClick={() => onAvatarChange(null)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
