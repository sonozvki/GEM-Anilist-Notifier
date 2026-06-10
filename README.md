<div align="center">
  <img src="/.github/assets/umi-asanagi-anime-onesie.gif" width="160" alt="GEM" />

  # GEM : AniList Notifier

  Bot Discord qui check ton AniList et t'envoie une notification dès qu'un nouvel épisode sort.
</div>

---

## Fonctionnalités

- Notifie un channel Discord à chaque nouvel épisode
- Mentionne uniquement les membres abonnés à cet anime
- Commandes slash pour gérer les abonnements (`/subscribe`, `/unsubscribe`, `/subscriptions`)
- Rattrape les épisodes manqués si le bot était hors ligne

## Stack

- [Bun](https://bun.sh) - runtime & package manager
- [discord.js v14](https://discord.js.org)
- [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs)
- [node-cron](https://github.com/node-cron/node-cron)
- Docker - conteneurisation

## Structure du projet

```
src/
├── app/                  # Point d'entrée, enregistrement du cron
├── features/
│   ├── anime-notifier/   # Détection des épisodes & notifications Discord
│   └── subscriptions/    # Commandes slash & abonnements par utilisateur
├── entities/anime/       # Types métier anime
└── shared/               # Config, logger, client Discord, API AniList
tests/                    # Tests unitaires (bun test)
docker/                   # Dockerfile + fichiers compose
data/                     # État JSON runtime (gitignore)
```

Architecture inspirée de [Feature-Sliced Design](https://feature-sliced.design).

## Installation

### 1. Prérequis

- [Bun](https://bun.sh) installé (ou Docker)
- Un bot Discord créé sur le [Developer Portal](https://discord.com/developers/applications)
- Un compte [AniList](https://anilist.co) avec une liste en cours

### 2. Configurer l'environnement

```bash
cp .env.example .env.development
```

Remplir `.env.development` :

| Variable | Où la trouver |
|---|---|
| `TOKEN_BOT` | Discord Developer Portal → Bot → Token |
| `CLIENT_ID` | Discord Developer Portal → Application ID |
| `GUILD_ID` | Discord → clic droit sur le serveur → Copier l'identifiant |
| `CHANNEL_ID` | Discord → clic droit sur le channel → Copier l'identifiant |
| `ANILIST_USERNAME` | URL de ton profil AniList |

> Activer le **Mode développeur** dans Discord (Paramètres → Avancé) pour accéder aux options "Copier l'identifiant".

### 3. Inviter le bot

Dans le Developer Portal → OAuth2 → URL Generator :
- Scopes : `bot`
- Permissions : `Send Messages`, `Embed Links`

Ouvrir l'URL générée et ajouter le bot à ton serveur.

### 4. Installer les dépendances

```bash
bun install
```

## Lancer le bot

```bash
# Développement (hot-reload, cron toutes les minutes)
bun dev

# Production
bun start

# Avec Docker
bun run docker:dev    # développement
bun run docker:prod   # production
```

Au premier démarrage, le bot enregistre l'état sans notifier. Les notifications commencent à partir de l'épisode suivant.

## Commandes slash

| Commande | Description |
|---|---|
| `/subscribe` | S'abonner aux notifications d'un anime |
| `/unsubscribe` | Se désabonner d'un anime |
| `/subscriptions` | Voir ses abonnements actifs |

Les réponses sont éphémères (visibles uniquement par toi).

## Développement

```bash
bun run typecheck   # Vérification des types
bun test tests/     # Lancer les tests
```

## Fonctionnement

Toutes les heures en production (toutes les minutes en dev), le bot :

1. Récupère ta liste AniList en cours
2. Compare le `nextAiringEpisode` actuel avec l'état stocké
3. Si le numéro d'épisode a avancé → envoie une notification avec un embed Discord
4. Mentionne les membres abonnés à cet anime
5. Met à jour l'état stocké

La liste est mise en cache 5 minutes pour que l'autocomplete reste instantané.

---

<div align="center">
  <img src="/.github/assets/i-made-friends-with-the-second-prettiest-girl-in-my-class.gif" alt="hehe" />
</div>
