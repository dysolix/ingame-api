import IngameAPI from "../index.js";

IngameAPI.on("started", () => console.log("Game started"));
IngameAPI.on("stopped", () => console.log("Game stopped"));
IngameAPI.on("event", (event) => console.log("Event", event));
IngameAPI.on("game-started", (event) => console.log("Game started", event));
IngameAPI.on("minions-spawning", (event) => console.log("Minions spawning", event));
IngameAPI.on("first-turret-destroyed", (event) => console.log("First turret destroyed", event));
IngameAPI.on("turret-destroyed", (event) => console.log("Turret destroyed", event));
IngameAPI.on("inhibitor-destroyed", (event) => console.log("Inhibitor destroyed", event));
IngameAPI.on("inhibitor-respawned", (event) => console.log("Inhibitor respawned", event));
IngameAPI.on("dragon-killed", (event) => console.log("Dragon killed", event));
IngameAPI.on("void-grub-killed", (event) => console.log("Void grub killed", event));
IngameAPI.on("herald-killed", (event) => console.log("Herald killed", event));
IngameAPI.on("baron-killed", (event) => console.log("Baron killed", event));
IngameAPI.on("champion-killed", (event) => console.log("Champion killed", event));
IngameAPI.on("multikill", (event) => console.log("Multikill", event));
IngameAPI.on("ace", (event) => console.log("Ace", event));
IngameAPI.on("game-ended", (event) => console.log("Game ended", event));

IngameAPI.startEventAPI();