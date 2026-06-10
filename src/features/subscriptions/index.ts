import { REST, Routes } from "discord.js";
import { config } from "@shared/config/env";
import { logger } from "@shared/lib/logger";
import { subscriptionCommands } from "./ui/commands";
export { handleAutocomplete, handleCommand } from "./ui/handlers";

export async function registerCommands(): Promise<void> {
  const rest = new REST().setToken(config.discord.token);

  await rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), {
    body: subscriptionCommands,
  });

  logger.info(`${subscriptionCommands.length} slash command(s) registered`);
}
