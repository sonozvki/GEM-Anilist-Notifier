import type { AiringEpisode } from "@entities/anime/types";

const ANILIST_API = "https://graphql.anilist.co";

const WATCHING_LIST_QUERY = `
  query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
      lists {
        entries {
          media {
            id
            siteUrl
            title { userPreferred }
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
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: WATCHING_LIST_QUERY, variables: { username } }),
  });

  if (!res.ok) throw new Error(`AniList API error: ${res.status}`);

  const json = (await res.json()) as any;
  const lists: any[] = json?.data?.MediaListCollection?.lists ?? [];
  const result: AiringEpisode[] = [];

  for (const list of lists) {
    for (const entry of list.entries) {
      const media = entry.media;
      if (!media.nextAiringEpisode) continue;

      result.push({
        mediaId: media.id,
        title: media.title.userPreferred,
        episode: media.nextAiringEpisode.episode,
        airingAt: media.nextAiringEpisode.airingAt,
        coverImage: media.coverImage.large,
        siteUrl: media.siteUrl,
      });
    }
  }

  return result;
}
