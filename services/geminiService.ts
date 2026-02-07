
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, Subject, StudyAvailability, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (
  profile: StudentProfile,
  subjects: Subject[],
  availability: StudyAvailability,
  targetDate: string
): Promise<StudyPlan> => {
  const prompt = `
    Generate a highly personalized study plan for an engineering student.
    
    Student Profile:
    - Name: ${profile.name}
    - College: ${profile.college}
    - Branch: ${profile.branch}
    - Graduation Year: ${profile.graduationYear}

    Subjects to cover:
    ${subjects.map(s => `- ${s.name}: ${s.credits} Credits, Confidence: ${s.confidence}/5, Strong in: ${s.strongTopics}, Weak in: ${s.weakTopics}`).join('\n')}

    Availability:
    - Weekdays: ${availability.weekdayHours} hours/day
    - Weekends: ${availability.weekendHours} hours/day
    - Preferred Time: ${availability.preferredTime}
    - Target Date: ${targetDate}

    CORE LOGIC REQUIREMENTS:
    1. Allocate more time to higher credit subjects and lower confidence subjects.
    2. Focus on weak topics before dependent topics (especially for engineering fundamentals).
    3. Schedule High-Focus tasks during ${availability.preferredTime}.
    4. Balance sessions between Learning, Practice, Revision, and include explicit Buffer time.
    5. Ensure the daily schedule is actionable for a 7-day visualization.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailySchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subjectName: { type: Type.STRING },
                      taskType: { type: Type.STRING, description: "Learning, Practice, Revision, or Buffer" },
                      durationMinutes: { type: Type.NUMBER },
                      load: { type: Type.STRING, description: "High, Medium, Low, or Buffer" },
                      timeSlot: { type: Type.STRING, description: "e.g., 09:00 - 11:00" },
                      topic: { type: Type.STRING }
                    },
                    required: ["subjectName", "taskType", "durationMinutes", "load", "timeSlot", "topic"]
                  }
                }
              },
              required: ["day", "tasks"]
            }
          },
          subjectInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subjectName: { type: Type.STRING },
                timeAllocationPercent: { type: Type.NUMBER },
                justification: { type: Type.STRING }
              }
            }
          },
          prioritizationLogic: { type: Type.STRING },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          expectedOutcome: {
            type: Type.OBJECT,
            properties: {
              completionDate: { type: Type.STRING },
              confidenceImprovement: { type: Type.STRING },
              stressReductionNote: { type: Type.STRING }
            }
          }
        },
        required: ["dailySchedule", "subjectInsights", "prioritizationLogic", "nextSteps", "expectedOutcome"]
      }
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
