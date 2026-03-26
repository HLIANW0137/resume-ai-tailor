import * as React from 'react';
import { ResumeData, OptimizationProposal } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skeleton } from './ui/skeleton';
import { Language, t } from '../i18n';

interface ResumePreviewProps {
  data: ResumeData | null;
  proposals: OptimizationProposal[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  themeColor: string;
  lineSpacing: 'tight' | 'snug' | 'normal' | 'relaxed';
  twoColumn: { education: boolean; honors: boolean };
  avatarUrl: string | null;
  language: Language;
}

export function ResumePreview({ data, proposals, onAccept, onReject, themeColor, lineSpacing, twoColumn, avatarUrl, language }: ResumePreviewProps) {
  if (!data) {
    return (
      <div className="w-full h-full p-12 flex flex-col gap-8 opacity-50">
        <div className="flex flex-col items-center gap-4 border-b pb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const spacingMap = {
    tight: { pagePad: 'p-6', headerMb: 'mb-3', sectionMb: 'mb-3', itemMb: 'mb-1', leading: 'leading-tight', gap: 'gap-1', text: 'text-xs' },
    snug: { pagePad: 'p-8', headerMb: 'mb-4', sectionMb: 'mb-4', itemMb: 'mb-2', leading: 'leading-snug', gap: 'gap-2', text: 'text-[13px]' },
    normal: { pagePad: 'p-10', headerMb: 'mb-6', sectionMb: 'mb-5', itemMb: 'mb-3', leading: 'leading-normal', gap: 'gap-3', text: 'text-sm' },
    relaxed: { pagePad: 'p-12', headerMb: 'mb-8', sectionMb: 'mb-6', itemMb: 'mb-4', leading: 'leading-relaxed', gap: 'gap-4', text: 'text-sm' },
  };
  const s = spacingMap[lineSpacing];

  const renderSection = (
    title: string,
    items: any[],
    renderItem: (item: any) => React.ReactNode,
    isTwoColumn: boolean = false
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div className={s.sectionMb}>
        <h2 className={cn("font-bold uppercase tracking-widest border-b border-zinc-300 pb-1 mb-2", s.text)} style={{ color: themeColor }}>
          {title}
        </h2>
        <div className={cn(isTwoColumn ? `grid grid-cols-2 gap-x-6 gap-y-2` : "space-y-2")}>{items.map(renderItem)}</div>
      </div>
    );
  };

  const renderOptimizableText = (id: string, text: string) => {
    const proposal = proposals.find(p => p.moduleId === id && p.status === 'pending');
    
    if (!proposal) {
      return <p className={cn("whitespace-pre-wrap text-zinc-700", s.leading, s.text)}>{text}</p>;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative group cursor-pointer rounded-md border-2 border-dashed border-amber-400 bg-amber-50/30 p-2 -mx-2 transition-colors hover:bg-amber-50 print:border-none print:bg-transparent print:p-0 print:mx-0">
            <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-1 shadow-sm print:hidden">
              <Sparkles className="w-3 h-3" />
            </div>
            <p className={cn("whitespace-pre-wrap opacity-60 print:opacity-100 text-zinc-700", s.leading, s.text)}>
              {text}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent side="left" align="start" className="w-96 p-0 overflow-hidden shadow-xl border-amber-200">
          <div className="bg-amber-50 p-3 border-b border-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">AI Optimization Suggestion</span>
          </div>
          <div className="p-4 space-y-4 bg-white">
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
              {proposal.reasoning}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Original</div>
                <div className="text-xs text-zinc-500 line-through decoration-red-300">
                  {proposal.originalText}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Optimized</div>
                <div className="text-xs text-zinc-900 font-medium">
                  {proposal.optimizedText}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onReject(proposal.moduleId)}>
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => onAccept(proposal.moduleId)}>
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className={cn("font-sans max-w-[210mm] mx-auto text-zinc-900", s.pagePad)}>
      {/* Header */}
      <div className={cn("flex justify-between items-start", s.headerMb)}>
        <div className={cn("flex-1", avatarUrl ? "text-left" : "text-center")}>
          <h1 className="font-bold tracking-tight mb-2 text-3xl" style={{ color: themeColor }}>{data.personalInfo?.name}</h1>
          <div className={cn("flex flex-wrap text-zinc-700", avatarUrl ? "justify-start" : "justify-center", s.gap, s.text)}>
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          </div>
          {data.personalInfo?.summary && (
            <p className={cn("mt-3 text-zinc-700", avatarUrl ? "" : "max-w-2xl mx-auto", s.text, s.leading)}>
              {data.personalInfo.summary}
            </p>
          )}
        </div>
        {avatarUrl && (
          <div className="ml-6 shrink-0">
            <img src={avatarUrl} alt="Avatar" className="w-24 h-32 object-cover rounded-md border border-zinc-200 shadow-sm" />
          </div>
        )}
      </div>

      {/* Education */}
      {renderSection(t(language, 'resume.education'), data.education, (edu) => (
        <div key={edu.id || edu.school} className={twoColumn.education ? "" : s.itemMb}>
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="font-semibold" style={{ color: themeColor }}>{edu.school}</h3>
            <span className="text-xs font-medium text-zinc-500">
              {edu.startDate} - {edu.endDate}
            </span>
          </div>
          <div className={cn("text-zinc-700 font-medium", s.text)}>
            {edu.degree} {edu.major && `in ${edu.major}`}
          </div>
          {edu.courses && edu.courses.length > 0 && (
            <div className={cn("text-zinc-500 mt-0.5", s.text)}>
              <span className="font-medium text-zinc-600">{t(language, 'resume.courses')}</span> {edu.courses.join(', ')}
            </div>
          )}
        </div>
      ), twoColumn.education)}

      {/* Work Experience */}
      {renderSection(t(language, 'resume.work'), data.workExperience, (work) => (
        <div key={work.id} className={s.itemMb}>
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="font-semibold" style={{ color: themeColor }}>{work.company}</h3>
            <span className="text-xs font-medium text-zinc-500">
              {work.startDate} - {work.endDate}
            </span>
          </div>
          <div className={cn("font-medium mb-1.5 text-zinc-800", s.text)}>{work.position}</div>
          {renderOptimizableText(work.id, work.description)}
        </div>
      ))}

      {/* Project Experience */}
      {renderSection(t(language, 'resume.projects'), data.projectExperience, (proj) => (
        <div key={proj.id} className={s.itemMb}>
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="font-semibold" style={{ color: themeColor }}>{proj.name}</h3>
            <span className="text-xs font-medium text-zinc-500">
              {proj.startDate} - {proj.endDate}
            </span>
          </div>
          <div className={cn("font-medium mb-1.5 text-zinc-800", s.text)}>{proj.role}</div>
          {renderOptimizableText(proj.id, proj.description)}
        </div>
      ))}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className={s.sectionMb}>
          <h2 className={cn("font-bold uppercase tracking-widest border-b border-zinc-300 pb-1 mb-2", s.text)} style={{ color: themeColor }}>
            {t(language, 'resume.skills')}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, index) => (
              <span key={index} className={cn("rounded-md bg-zinc-100 text-zinc-700 px-1.5 py-0.5", s.text)}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Honors & Awards */}
      {data.honors && data.honors.length > 0 && (
        <div className={s.sectionMb}>
          <h2 className={cn("font-bold uppercase tracking-widest border-b border-zinc-300 pb-1 mb-2", s.text)} style={{ color: themeColor }}>
            {t(language, 'resume.honors')}
          </h2>
          <ul className={cn("list-disc list-inside text-zinc-700", s.leading, s.text, twoColumn.honors ? "grid grid-cols-2 gap-x-4" : "space-y-0.5")}>
            {data.honors.map((honor, index) => (
              <li key={index}>{honor}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className={s.sectionMb}>
          <h2 className={cn("font-bold uppercase tracking-widest border-b border-zinc-300 pb-1 mb-2", s.text)} style={{ color: themeColor }}>
            {t(language, 'resume.languages')}
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <span key={index} className={cn("font-medium text-zinc-700", s.text)}>
                • {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests && data.interests.length > 0 && (
        <div className={s.sectionMb}>
          <h2 className={cn("font-bold uppercase tracking-widest border-b border-zinc-300 pb-1 mb-2", s.text)} style={{ color: themeColor }}>
            {t(language, 'resume.interests')}
          </h2>
          <p className={cn("text-zinc-700", s.leading, s.text)}>
            {data.interests.join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}
