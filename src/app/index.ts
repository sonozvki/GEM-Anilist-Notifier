import { config } from "@shared/config/env";
import { discordClient } from "@shared/discord/client";
import { logger } from "@shared/lib/logger";
import { registerCronJobs } from "./cron";

discordClient.once("ready", () => {
  logger.info(`Bot ready as ${discordClient.user?.tag} [${config.env}]`);
  registerCronJobs();
});

discordClient.login(config.discord.token);
