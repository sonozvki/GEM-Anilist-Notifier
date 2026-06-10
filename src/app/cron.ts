import cron from "node-cron";
import { config } from "@shared/config/env";
import { logger } from "@shared/lib/logger";
import { runAnimeNotifier } from "@features/anime-notifier";

export function registerCronJobs(): void {
  cron.schedule(config.cron.schedule, async () => {
    try {
      await runAnimeNotifier();
    } catch (err) {
      logger.error("Anime notifier failed", err);
    }
  });

  logger.info(`Cron registered [${config.cron.schedule}]`);
}
