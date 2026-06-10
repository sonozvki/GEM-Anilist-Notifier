import { config } from "@shared/config/env";
import { discordClient } from "@shared/discord/client";
import { logger } from "@shared/lib/logger";
import {
  handleAutocomplete,
  handleCommand,
  registerCommands,
} from "@features/subscriptions";
import { registerCronJobs } from "./cron";

discordClient.once("clientReady", async () => {
  logger.info(`Bot ready as ${discordClient.user?.tag} [${config.env}]`);
  await registerCommands();
  registerCronJobs();
});

discordClient.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isAutocomplete()) {
      await handleAutocomplete(interaction);
    } else if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    }
  } catch (err) {
    logger.error("Interaction error", err);
  }
});

discordClient.login(config.discord.token);
