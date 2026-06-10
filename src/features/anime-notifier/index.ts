import type { TextChannel } from "discord.js";
import { config } from "@shared/config/env";
import { discordClient } from "@shared/discord/client";
import { logger } from "@shared/lib/logger";
import { fetchWatchingList } from "./api/anilist";
import { applyWatchingList, detectNewEpisodes } from "./model/notifier-logic";
import { loadState, saveState } from "./model/storage";
import { buildEpisodeEmbed } from "./ui/embed";

export async function runAnimeNotifier(): Promise<void> {
  logger.info("Running anime notifier check...");

  const [watchingList, state] = await Promise.all([
    fetchWatchingList(config.anilist.username),
    loadState(),
  ]);

  const channel = await discordClient.channels.fetch(config.discord.channelId);
  if (!channel?.isTextBased()) {
    logger.error("Channel not found or not text-based");
    return;
  }

  const notifications = detectNewEpisodes(watchingList, state);

  for (const { anime, episode } of notifications) {
    const embed = buildEpisodeEmbed(anime, episode);
    await (channel as TextChannel).send({ embeds: [embed] });
    logger.info(`Notified: ${anime.title} ep ${episode}`);
  }

  const nextState = applyWatchingList(watchingList, state);
  await saveState(nextState);

  logger.info(`Check done. ${notifications.length} notification(s) sent.`);
}
