export interface AiringEpisode {
  mediaId: number;
  title: string;
  episode: number;
  airingAt: number; // unix timestamp
  coverImage: string;
  siteUrl: string;
}
