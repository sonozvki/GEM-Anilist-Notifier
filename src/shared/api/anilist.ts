import type { AiringEpisode } from "@entities/anime/types";

const ANILIST_API = "https://graphql.anilist.co";
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache: { data: AiringEpisode[]; expiry: number } | null = null;

interface AniListResponse
{
  data: {
    MediaListCollection: {
      lists: Array<{
        entries: Array<{
          media: {
            id: number;
            siteUrl: string;
            title: { userPreferred: string; english: string | null };
            coverImage: { large: string };
            nextAiringEpisode: { episode: number; airingAt: number } | null;
          };
        }>;
      }>;
    };
  };
}

const WATCHING_LIST_QUERY = `
  query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
      lists {
        entries {
          media {
            id
            siteUrl
            title { userPreferred english }
            coverImage { large }
            nextAiringEpisode {
              episode
              airingAt
            }
          }
        }
      }
    }
  }
`;

export async function fetchWatchingList(username: string): Promise<AiringEpisode[]> {
  if (cache && Date.now() < cache.expiry) return cache.data;

  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: WATCHING_LIST_QUERY, variables: { username } }),
  });

  if (!res.ok) throw new Error(`AniList API error: ${res.status}`);

  const { data } = (await res.json()) as AniListResponse;
  const result: AiringEpisode[] = [];

  for (const list of data.MediaListCollection.lists) {
    for (const entry of list.entries) {
      const { media } = entry;
      if (!media.nextAiringEpisode) continue;

      result.push({
        mediaId: media.id,
        title: media.title.english ?? media.title.userPreferred,
        episode: media.nextAiringEpisode.episode,
        airingAt: media.nextAiringEpisode.airingAt,
        coverImage: media.coverImage.large,
        siteUrl: media.siteUrl,
      });
    }
  }

  cache = { data: result, expiry: Date.now() + CACHE_TTL_MS };
  return result;
}

export function invalidateWatchingListCache(): void {
  cache = null;
}
