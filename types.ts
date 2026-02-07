
export type Theme = 'light' | 'dark';

export interface StudentProfile {
  name: string;
  college: string;
  branch: string;
  graduationYear: string;
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  strongTopics: string;
  weakTopics: string;
  confidence: number; // 1-5
}

export type StudyTimePreference = 'morning' | 'afternoon' | 'night';

export interface StudyAvailability {
  weekdayHours: number;
  weekendHours: number;
  preferredTime: StudyTimePreference;
}

export enum CognitiveLoad {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  BUFFER = 'Buffer'
}

export interface StudyTask {
  subjectName: string;
  taskType: 'Learning' | 'Practice' | 'Revision' | 'Buffer';
  durationMinutes: number;
  load: CognitiveLoad;
  timeSlot: string;
  topic: string;
}

export interface DailySchedule {
  day: string;
  tasks: StudyTask[];
}

export interface SubjectInsight {
  subjectName: string;
  timeAllocationPercent: number;
  justification: string;
}

export interface StudyPlan {
  dailySchedule: DailySchedule[];
  subjectInsights: SubjectInsight[];
  prioritizationLogic: string;
  nextSteps: string[];
  expectedOutcome: {
    completionDate: string;
    confidenceImprovement: string;
    stressReductionNote: string;
  };
}
