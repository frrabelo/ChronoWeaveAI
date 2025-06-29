
export interface TimelineEventData {
  component: 'Timeline_Event';
  date: string;
  title: string;
  description: string;
  category: 'Invenção' | 'Conflito' | 'Descoberta' | 'Arte' | string;
  image_query: string;
}

export interface TimelineContent {
  component: 'Timeline_Page';
  title: string;
  summary: string;
  events_container: TimelineEventData[];
}

export interface TimelineStory {
  name: string;
  slug: string;
  content: TimelineContent;
}

export interface TimelineResponse {
  story: TimelineStory;
}
