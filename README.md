# @hasagi/ingame-api

A typed wrapper around the League of Legends **Live Client Data API** (the in-game API served at
`https://127.0.0.1:2999` during an active match), enhanced with a higher-level **Event API** that
polls the live data and emits semantic game events.

Extracted from [`@hasagi/extended`](https://www.npmjs.com/package/@hasagi/extended) and focused on
in-game data.

## Installation

```bash
npm install @hasagi/ingame-api
```

## Quick start

```ts
import { IngameAPI } from "@hasagi/ingame-api";

IngameAPI.on("game-started", () => console.log("Game started!"));
IngameAPI.on("dragon-killed", (event) => console.log("Dragon killed:", event));
IngameAPI.on("champion-killed", (event) => console.log(`${event.KillerName} killed ${event.VictimName}`));

// Waits for the live client to be available, then starts polling for events.
await IngameAPI.startEventAPI({ pollIntervalMs: 1000 });

// later…
IngameAPI.stopEventAPI();
```

## Event API

`startEventAPI(options?)` waits for the live client to become available and then polls it on an
interval, emitting an event whenever something new happens. Polls never overlap — the next poll is
scheduled only after the current one resolves.

```ts
await IngameAPI.startEventAPI({
  timeout: 30000,      // max time to wait for the live client (default: 30s)
  pollIntervalMs: 1000, // poll interval (default: 1000ms)
  cert: undefined,      // omit: use the bundled Riot cert; string: trust it; null: disable TLS validation
});
```

### Emitted events

`started`, `stopped`, `event` (every raw event), `error`, `game-started`, `minions-spawning`,
`first-turret-destroyed`, `turret-destroyed`, `inhibitor-destroyed`, `inhibitor-respawned`,
`dragon-killed`, `void-grub-killed`, `herald-killed`, `baron-killed`, `champion-killed`,
`multikill`, `ace`, `game-ended`.

The API stops automatically after repeated request failures (e.g. when the game ends).

## Disclaimer

Hasagi is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or
anyone officially involved in producing or managing Riot Games properties. Riot Games and all
associated properties are trademarks or registered trademarks of Riot Games, Inc.
