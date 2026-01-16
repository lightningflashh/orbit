export enum TopicLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Topic {
  id?: number;
  name: string;
  description?: string;
  level: TopicLevel
}