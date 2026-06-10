import { describe, expect, it } from "bun:test";
import { applyWatchingList, detectNewEpisodes } from "@features/anime-notifier/model/notifier-logic";
import type { StorageData } from "@features/anime-notifier/model/types";
import type { AiringEpisode } from "@entities/anime/types";

const makeAnime = (id: number, episode: number): AiringEpisode => ({
  mediaId: id,
  title: `Anime ${id}`,
  episode,
  airingAt: Date.now() / 1000 + 604800,
  coverImage: "https://example.com/cover.jpg",
  siteUrl: `https://anilist.co/anime/${id}`,
});

describe("detectNewEpisodes", () => {
  it("returns nothing when state is empty (first run)", () => {
    const state: StorageData = { shows: {} };
    const result = detectNewEpisodes([makeAnime(1, 5)], state);
    expect(result).toHaveLength(0);
  });

  it("returns nothing when episode number has not changed", () => {
    const state: StorageData = {
      shows: { "1": { title: "Anime 1", nextEpisode: 5, nextAiringAt: 0 } },
    };
    const result = detectNewEpisodes([makeAnime(1, 5)], state);
    expect(result).toHaveLength(0);
  });

  it("detects a single new episode", () => {
    const state: StorageData = {
      shows: { "1": { title: "Anime 1", nextEpisode: 5, nextAiringAt: 0 } },
    };
    const result = detectNewEpisodes([makeAnime(1, 6)], state);
    expect(result).toHaveLength(1);
    expect(result[0].episode).toBe(5);
  });

  it("detects multiple missed episodes (bot was down)", () => {
    const state: StorageData = {
      shows: { "1": { title: "Anime 1", nextEpisode: 3, nextAiringAt: 0 } },
    };
    const result = detectNewEpisodes([makeAnime(1, 6)], state);
    expect(result).toHaveLength(3);
    expect(result.map((n) => n.episode)).toEqual([3, 4, 5]);
  });

  it("handles multiple shows independently", () => {
    const state: StorageData = {
      shows: {
        "1": { title: "Anime 1", nextEpisode: 5, nextAiringAt: 0 },
        "2": { title: "Anime 2", nextEpisode: 10, nextAiringAt: 0 },
      },
    };
    const result = detectNewEpisodes([makeAnime(1, 6), makeAnime(2, 10)], state);
    expect(result).toHaveLength(1);
    expect(result[0].anime.mediaId).toBe(1);
  });
});

describe("applyWatchingList", () => {
  it("adds new shows to state", () => {
    const state: StorageData = { shows: {} };
    const next = applyWatchingList([makeAnime(1, 5)], state);
    expect(next.shows["1"]).toBeDefined();
    expect(next.shows["1"].nextEpisode).toBe(5);
  });

  it("updates existing show state", () => {
    const state: StorageData = {
      shows: { "1": { title: "Anime 1", nextEpisode: 5, nextAiringAt: 0 } },
    };
    const next = applyWatchingList([makeAnime(1, 6)], state);
    expect(next.shows["1"].nextEpisode).toBe(6);
  });

  it("does not mutate the original state", () => {
    const state: StorageData = { shows: {} };
    applyWatchingList([makeAnime(1, 5)], state);
    expect(state.shows["1"]).toBeUndefined();
  });
});
