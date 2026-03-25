export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  summary: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectExperience {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projectExperience: ProjectExperience[];
  skills: string[];
  honors?: string[];
  languages?: string[];
  interests?: string[];
}

export interface OptimizationProposal {
  moduleId: string; // matches id of WorkExperience or ProjectExperience
  originalText: string;
  optimizedText: string;
  reasoning: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}
