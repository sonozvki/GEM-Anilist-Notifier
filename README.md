<div align="center">
  <img src="/.github/assets/umi-asanagi-anime-onesie.gif" width="160" alt="GEM" />

  # GEM: Your AniList Notifier

  Discord bot that watches your AniList and sends a notification when a new anime episode drops.
</div>

---

## Features

- Notifies a Discord channel when a new episode airs
- Pings only the users subscribed to that specific anime
- Slash commands to manage subscriptions (`/subscribe`, `/unsubscribe`, `/subscriptions`)
- Catches up on missed episodes if the bot was offline

## Stack

- [Bun](https://bun.sh) - runtime & package manager
- [discord.js v14](https://discord.js.org)
- [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs)
- [node-cron](https://github.com/node-cron/node-cron)
- Docker - containerization

## Project structure

```
src/
├── app/                  # Entry point, cron registration
├── features/
│   ├── anime-notifier/   # Episode detection & Discord notifications
│   └── subscriptions/    # Slash commands & per-user subscriptions
├── entities/anime/       # Shared anime types
└── shared/               # Config, logger, Discord client, AniList API
tests/                    # Unit tests (bun test)
docker/                   # Dockerfile + compose files
data/                     # Runtime JSON state (gitignored)
```

Architecture follows [Feature-Sliced Design](https://feature-sliced.design).

## Setup

### 1. Prerequisites

- [Bun](https://bun.sh) installed (or Docker)
- A Discord bot created on the [Developer Portal](https://discord.com/developers/applications)
- An [AniList](https://anilist.co) account with a watching list

### 2. Configure environment

```bash
cp .env.example .env.development
```

Fill in `.env.development`:

| Variable | Where to find it |
|---|---|
| `TOKEN_BOT` | Discord Developer Portal → Bot → Token |
| `CLIENT_ID` | Discord Developer Portal → Application ID |
| `GUILD_ID` | Discord → right-click your server → Copy Server ID |
| `CHANNEL_ID` | Discord → right-click the target channel → Copy Channel ID |
| `ANILIST_USERNAME` | Your AniList profile URL |

> Enable **Developer Mode** in Discord settings (Settings → Advanced) to access Copy ID options.

### 3. Invite the bot

In the Developer Portal → OAuth2 → URL Generator:
- Scopes: `bot`
- Permissions: `Send Messages`, `Embed Links`

Open the generated URL and add the bot to your server.

### 4. Install dependencies

```bash
bun install
```

## Running

```bash
# Development (hot-reload, cron every minute)
bun dev

# Production
bun start

# With Docker
bun run docker:dev    # development
bun run docker:prod   # production
```

On first run the bot stores the current state without notifying. Notifications start from the next episode onward.

## Slash commands

| Command | Description |
|---|---|
| `/subscribe` | Subscribe to episode notifications for an anime |
| `/unsubscribe` | Unsubscribe from an anime |
| `/subscriptions` | View your active subscriptions |

Responses are ephemeral (only visible to you).

## Development

```bash
bun run typecheck   # Type check
bun test tests/     # Run tests
```

## How it works

Every hour in production (every minute in dev), the bot:

1. Fetches your AniList watching list
2. Compares the current `nextAiringEpisode` with the stored state
3. If the episode number advanced → sends a notification with a Discord embed
4. Pings subscribed users for that anime
5. Updates the stored state

The watching list is cached for 5 minutes to keep autocomplete fast.

---

<div align="center">
  <img src="/.github/assets/i-made-friends-with-the-second-prettiest-girl-in-my-class.gif" alt="hehe" />
</div>
