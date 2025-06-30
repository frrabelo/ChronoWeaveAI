export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: 'Invention' | 'Conflict' | 'Discovery' | 'Art' | string;
  image_query: string;
  // Client-side populated
  imageBase64?: string;
}

export interface TimelineData {
  title: string;
  summary: string;
  events: TimelineEvent[];
}