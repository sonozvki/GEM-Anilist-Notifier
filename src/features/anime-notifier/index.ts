import type { TextChannel } from "discord.js";
import { config } from "@shared/config/env";
import { discordClient } from "@shared/discord/client";
import { logger } from "@shared/lib/logger";
import { fetchWatchingList } from "./api/anilist";
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

  let changed = false;

  for (const anime of watchingList) {
    const key = String(anime.mediaId);
    const stored = state.shows[key];

    if (!stored) {
      // First time seeing this show — store state without notifying to avoid flood
      state.shows[key] = {
        title: anime.title,
        nextEpisode: anime.episode,
        nextAiringAt: anime.airingAt,
      };
      changed = true;
      logger.debug(`New show tracked: ${anime.title} (next ep: ${anime.episode})`);
      continue;
    }

    if (anime.episode > stored.nextEpisode) {
      for (let ep = stored.nextEpisode; ep < anime.episode; ep++) {
        const embed = buildEpisodeEmbed(anime, ep);
        await (channel as TextChannel).send({ embeds: [embed] });
        logger.info(`Notified: ${anime.title} ep ${ep}`);
      }

      state.shows[key] = {
        title: anime.title,
        nextEpisode: anime.episode,
        nextAiringAt: anime.airingAt,
      };
      changed = true;
    }
  }

  if (changed) await saveState(state);
  logger.info("Check done.");
}
