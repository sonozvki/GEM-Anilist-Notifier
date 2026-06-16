import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { config } from "@shared/config/env";
import { logger } from "@shared/lib/logger";
import { fetchWatchingList } from "@shared/api/anilist";
import { addSubscriber, loadSubscriptions, removeSubscriber } from "../model/storage";

export async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
  try {
    const focused = interaction.options.getFocused().toLowerCase();
    const commandName = interaction.commandName;

    if (commandName === "subscribe") {
      const watchingList = await fetchWatchingList(config.anilist.username);
      logger.info(`Autocomplete subscribe: focused="${focused}", ${watchingList.length} shows in cache`);
      const choices = (focused ? watchingList.filter((a) => a.title.toLowerCase().includes(focused)) : watchingList)
        .slice(0, 25)
        .map((a) => ({ name: a.title.slice(0, 100), value: String(a.mediaId) }));
      logger.info(`Responding with ${choices.length} choices`);
      await interaction.respond(choices);
      return;
    }

    if (commandName === "unsubscribe") {
      const data = await loadSubscriptions();
      const choices = Object.entries(data)
        .filter(
          ([, entry]) =>
            entry.subscribers.includes(interaction.user.id) &&
            entry.title.toLowerCase().includes(focused),
        )
        .slice(0, 25)
        .map(([mediaId, entry]) => ({ name: entry.title.slice(0, 100), value: mediaId }));

      await interaction.respond(choices);
    }
  } catch {
    await interaction.respond([]).catch(() => {});
  }
}

export async function handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  switch (interaction.commandName) {
    case "subscribe": {
      const mediaId = interaction.options.getString("anime", true);
      const watchingList = await fetchWatchingList(config.anilist.username);
      const anime = watchingList.find((a) => String(a.mediaId) === mediaId);
      const title = anime?.title ?? mediaId;
      const added = await addSubscriber(mediaId, title, interaction.user.id);

      await interaction.reply({
        content: added ? `Abonné à **${title}** ! Tu recevras dorénavant une notif quand un épisode sortira` : `Tu es déjà abonné à **${title}**.`,
        flags: MessageFlags.Ephemeral,
      });
      break;
    }

    case "unsubscribe": {
      const mediaId = interaction.options.getString("anime", true);
      const data = await loadSubscriptions();
      const title = data[mediaId]?.title ?? mediaId;
      const removed = await removeSubscriber(mediaId, interaction.user.id);

      await interaction.reply({
        content: removed ? `Désabonné de **${title}**.` : `Tu n'étais pas abonné à **${title}**.`,
        flags: MessageFlags.Ephemeral,
      });
      break;
    }

    case "subscriptions": {
      const data = await loadSubscriptions();
      const subscribed = Object.values(data).filter((entry) =>
        entry.subscribers.includes(interaction.user.id),
      );

      const embed = new EmbedBuilder()
        .setColor(0x02a9ff)
        .setTitle("Tes abonnements")
        .setDescription(subscribed.length > 0 ? subscribed.map((e) => `• ${e.title}`).join("\n") : "Aucun abonnement actif.")
        .setFooter({ text: "AniList Notifier" });

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      break;
    }
  }
}
