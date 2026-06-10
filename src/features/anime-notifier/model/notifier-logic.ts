import type { AiringEpisode } from "@entities/anime/types";
import type { StorageData } from "./types";

export interface PendingNotification
{
  anime: AiringEpisode;
  episode: number;
}

export function detectNewEpisodes(watchingList: AiringEpisode[], state: StorageData) : PendingNotification[]
{
  const notifications: PendingNotification[] = [];

  for (const anime of watchingList) {
    const stored = state.shows[String(anime.mediaId)];
    if (!stored) continue;
    if (anime.episode > stored.nextEpisode) {
      for (let ep = stored.nextEpisode; ep < anime.episode; ep++) {
        notifications.push({ anime, episode: ep });
      }
    }
  }
  return notifications;
}

export function applyWatchingList(watchingList: AiringEpisode[]): StorageData {
  const shows: StorageData["shows"] = {};

  for (const anime of watchingList) {
    shows[String(anime.mediaId)] = {
      title: anime.title,
      nextEpisode: anime.episode,
      nextAiringAt: anime.airingAt,
    };
  }

  return { shows };
}
