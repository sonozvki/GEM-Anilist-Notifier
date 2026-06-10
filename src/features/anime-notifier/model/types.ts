export interface ShowState
{
  title: string;
  nextEpisode: number;
  nextAiringAt: number;
}

export interface StorageData
{
  shows: Record<string, ShowState>; // key: mediaId as string
}
