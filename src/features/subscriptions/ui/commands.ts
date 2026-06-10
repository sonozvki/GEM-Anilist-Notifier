import { SlashCommandBuilder } from "discord.js";

export const subscriptionCommands = [
  new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("Recevoir les notifs de cet anime")
    .addStringOption((opt) =>
      opt.setName("anime").setDescription("Nom de l'anime").setRequired(true).setAutocomplete(true),
    ),

  new SlashCommandBuilder()
    .setName("unsubscribe")
    .setDescription("Ne plus recevoir les notifs de cet anime")
    .addStringOption((opt) =>
      opt.setName("anime").setDescription("Nom de l'anime").setRequired(true).setAutocomplete(true),
    ),

  new SlashCommandBuilder()
    .setName("subscriptions")
    .setDescription("Voir les animes auxquels je reçois les notifs"),
].map((cmd) => cmd.toJSON());
