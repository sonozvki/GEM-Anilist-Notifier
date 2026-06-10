import { EmbedBuilder } from "discord.js";
import type { AiringEpisode } from "@entities/anime/types";

export function buildEpisodeEmbed(anime: AiringEpisode, episode: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x02a9ff)
    .setTitle(anime.title)
    .setURL(anime.siteUrl)
    .setDescription(`L'épisode **${episode}** est dispo !`)
    .setThumbnail(anime.coverImage)
    .setTimestamp()
    .setFooter({ text: "AniList Notifier" });
}
