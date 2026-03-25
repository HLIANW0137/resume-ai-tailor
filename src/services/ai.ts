import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, OptimizationProposal, ApiConfig } from "../types";

function extractJSON(text: string) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  return JSON.parse(text);
}

async function callCustomAPI(prompt: string, config: ApiConfig) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    let errText = "Unknown error";
    try {
      const err = await response.json();
      errText = err.error || JSON.stringify(err);
    } catch (e) {
      errText = await response.text();
    }
    throw new Error(`API Error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return extractJSON(content);
}

export async function parseResume(rawText: string, config: ApiConfig): Promise<ResumeData> {
  const isCustom = config.baseUrl && config.baseUrl.trim() !== '';

  if (!isCustom) {
    const key = config.apiKey;
    if (!key) throw new Error("API Key is missing. Please configure it in Settings.");
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: config.model || "gemini-3.1-pro-preview",
      contents: `Parse the following raw resume text into a structured JSON format. 
Make sure to extract all relevant information. If some fields are missing, leave them empty.
For work and project experiences, generate a unique short string ID (e.g., "w1", "p1") for each entry.

Raw Resume Text:
${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["name", "email", "phone", "summary"],
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  major: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  courses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Relevant coursework or professional courses taken",
                  },
                },
                required: ["id", "school", "degree", "major", "startDate", "endDate"],
              },
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "company", "position", "startDate", "endDate", "description"],
              },
            },
            projectExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "name", "role", "startDate", "endDate", "description"],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            honors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interests: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["personalInfo", "education", "workExperience", "projectExperience", "skills", "honors", "languages", "interests"],
        },
      },
    });
    const text = response.text;
    if (!text) throw new Error("Failed to parse resume");
    return JSON.parse(text) as ResumeData;
  }

  // Custom API
  const prompt = `Parse the following raw resume text into a structured JSON format. 
Make sure to extract all relevant information. If some fields are missing, leave them empty.
For work and project experiences, generate a unique short string ID (e.g., "w1", "p1") for each entry.

You MUST return ONLY valid JSON. Do not include any other text or markdown formatting outside the JSON object.
Expected JSON structure:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "summary": "" },
  "education": [{ "id": "", "school": "", "degree": "", "major": "", "startDate": "", "endDate": "", "courses": [""] }],
  "workExperience": [{ "id": "", "company": "", "position": "", "startDate": "", "endDate": "", "description": "" }],
  "projectExperience": [{ "id": "", "name": "", "role": "", "startDate": "", "endDate": "", "description": "" }],
  "skills": [""],
  "honors": [""],
  "languages": [""],
  "interests": [""]
}

Raw Resume Text:
${rawText}`;

  return await callCustomAPI(prompt, config) as ResumeData;
}

export async function optimizeResume(resumeData: ResumeData, jd: string, config: ApiConfig): Promise<OptimizationProposal[]> {
  const isCustom = config.baseUrl && config.baseUrl.trim() !== '';

  if (!isCustom) {
    const key = config.apiKey;
    if (!key) throw new Error("API Key is missing. Please configure it in Settings.");
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: config.model || "gemini-3.1-pro-preview",
      contents: `You are an expert resume writer and career coach.
I will provide you with a structured resume and a Job Description (JD).
Your task is to optimize the descriptions of the Work Experience and Project Experience sections to better match the JD.
Use the STAR method (Situation, Task, Action, Result) where appropriate, and incorporate relevant keywords from the JD.
Do NOT hallucinate fake experiences; only rewrite and emphasize existing points to align with the JD.

For each work or project experience you optimize, provide:
1. The moduleId (the exact id from the provided resume data).
2. The originalText (the exact original description).
3. The optimizedText (your rewritten description).
4. The reasoning (a brief explanation of why you made these changes, e.g., "Added 'data analysis' keyword and quantified results.").

If an experience doesn't need optimization, you can skip it.

Resume Data:
${JSON.stringify({ workExperience: resumeData.workExperience, projectExperience: resumeData.projectExperience }, null, 2)}

Job Description:
${jd}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proposals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  moduleId: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  optimizedText: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ["moduleId", "originalText", "optimizedText", "reasoning"],
              },
            },
          },
          required: ["proposals"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Failed to optimize resume");
    const result = JSON.parse(text);
    
    return result.proposals.map((p: any) => ({
      ...p,
      status: 'pending'
    })) as OptimizationProposal[];
  }

  // Custom API
  const prompt = `You are an expert resume writer and career coach.
I will provide you with a structured resume and a Job Description (JD).
Your task is to optimize the descriptions of the Work Experience and Project Experience sections to better match the JD.
Use the STAR method (Situation, Task, Action, Result) where appropriate, and incorporate relevant keywords from the JD.
Do NOT hallucinate fake experiences; only rewrite and emphasize existing points to align with the JD.

You MUST return ONLY valid JSON. Do not include any other text or markdown formatting outside the JSON object.
Expected JSON structure:
{
  "proposals": [
    {
      "moduleId": "exact id from the provided resume data",
      "originalText": "exact original description",
      "optimizedText": "rewritten description",
      "reasoning": "brief explanation of changes"
    }
  ]
}

If an experience doesn't need optimization, you can skip it.

Resume Data:
${JSON.stringify({ workExperience: resumeData.workExperience, projectExperience: resumeData.projectExperience }, null, 2)}

Job Description:
${jd}`;

  const result = await callCustomAPI(prompt, config);
  
  return result.proposals.map((p: any) => ({
    ...p,
    status: 'pending'
  })) as OptimizationProposal[];
}
