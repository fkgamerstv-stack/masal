
export interface Page {
  text: string;
  illustrationPrompt: string;
  imageUrl?: string;
  audioData?: string;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  pages: Page[];
  coverImage?: string;
  category: string;
  createdAt: number;
}

export interface StoryGenerationConfig {
  childName: string;
  age: number;
  theme: string;
  keywords: string;
}

export enum AppState {
  LIBRARY = 'LIBRARY',
  GENERATING = 'GENERATING',
  READING = 'READING'
}
