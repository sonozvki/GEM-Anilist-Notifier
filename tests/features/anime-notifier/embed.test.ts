import { describe, expect, it } from "bun:test";
import { buildEpisodeEmbed } from "@features/anime-notifier/ui/embed";
import type { AiringEpisode } from "@entities/anime/types";

const anime: AiringEpisode = {
  mediaId: 42,
  title: "Shingeki no Kyojin",
  episode: 10,
  airingAt: 0,
  coverImage: "https://example.com/cover.jpg",
  siteUrl: "https://anilist.co/anime/16498",
};

describe("buildEpisodeEmbed", () => {
  it("sets the anime title", () => {
    const embed = buildEpisodeEmbed(anime, 9);
    expect(embed.data.title).toBe("Shingeki no Kyojin");
  });

  it("mentions the correct episode number in the description", () => {
    const embed = buildEpisodeEmbed(anime, 9);
    expect(embed.data.description).toContain("9");
  });

  it("sets the AniList URL", () => {
    const embed = buildEpisodeEmbed(anime, 9);
    expect(embed.data.url).toBe(anime.siteUrl);
  });

  it("sets the cover image as thumbnail", () => {
    const embed = buildEpisodeEmbed(anime, 9);
    expect(embed.data.thumbnail?.url).toBe(anime.coverImage);
  });
});
