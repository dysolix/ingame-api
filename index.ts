import { TypedEmitter } from "tiny-typed-emitter";
import axios from "axios";
import { Agent } from "https";

enum Team {
    Blue = "ORDER",
    Red = "CHAOS"
}

type BooleanString = "True" | "False";

namespace IngameAPI {
    export type LocalPlayerAbilities = {
        Passive: LiveClientPassiveAbility,
        Q: LiveClientAbility,
        W: LiveClientAbility,
        E: LiveClientAbility,
        R: LiveClientAbility,
    }

    export type LocalPlayer = {
        abilities: LocalPlayerAbilities;
        championStats: LiveClientChampionStats;
        currentGold: number;
        fullRunes: LocalPlayerRunes;
        level: number;
        summonerName: string;
    }

    export type LocalPlayerRunes = {
        keystone: LiveClientKeystone;
        primaryRuneTree: LiveClientRuneTree;
        secondaryRuneTree: LiveClientRuneTree;
        generalRunes: LiveClientRuneTree[];
        statRunes: LiveClientStatRune[];
    }

    export type LiveClientStatRune = {
        id: number;
        rawDescription: string;
    }

    export type LiveClientChampionStats = {
        abilityHaste: number;
        abilityPower: number;
        armor: number;
        armorPenetrationFlat: number;
        armorPenetrationPercent: number;
        attackDamage: number;
        attackRange: number;
        attackSpeed: number;
        bonusArmorPenetrationPercent: number;
        bonusMagicPenetrationPercent: number;
        cooldownReduction: number;
        critChance: number;
        critDamage: number;
        currentHealth: number;
        healthRegenRate: number;
        lifeSteal: number;
        magicLethality: number;
        magicPenetrationFlat: number;
        magicPenetrationPercent: number;
        magicResist: number;
        maxHealth: number;
        moveSpeed: number;
        physicalLethality: number;
        resourceMax: number;
        resourceRegenRate: number;
        resourceType: string;
        resourceValue: number;
        spellVamp: number;
        tenacity: number;
    }

    export type LiveClientRuneTree = {
        displayName: string;
        id: number;
        rawDescription: string;
        rawDisplayName: string;
    }

    export type LiveClientKeystone = {
        displayName: string;
        id: number;
        rawDescription: string;
        rawDisplayName: string;
    }

    export type GameStats = {
        gameMode: string;
        gameTime: number;
        mapName: string;
        mapNumber: number;
        mapTerrain: string;
    }

    export type Player = {
        championName: string;
        isBot: boolean;
        isDead: boolean;
        items: PlayerItem[];
        level: number;
        position: string;
        rawChampionName: string;
        respawnTimer: number;
        runes: PlayerMainRunes;
        scores: PlayerScores;
        skinID: number;
        summonerName: string;
        summonerSpells: PlayerSummonerSpells;
        team: string;
    }

    export type PlayerMainRunes = {
        keystone: LiveClientKeystone;
        primaryRuneTree: LiveClientRuneTree;
        secondaryRuneTree: LiveClientRuneTree;
    }

    export type PlayerSummonerSpells = {
        summonerSpellOne: LiveClientSummonerSpell;
        summonerSpellTwo: LiveClientSummonerSpell;
    }

    export type PlayerItem = {
        canUse: boolean;
        consumable: boolean;
        count: number;
        displayName: string;
        itemID: number;
        price: number;
        rawDescription: string;
        rawDisplayName: string;
        slot: number;
    }

    export type LiveClientPassiveAbility = {
        displayName: string;
        id: string;
        rawDescription: string;
        rawDisplayName: string;
    }

    export type LiveClientAbility = {
        abilityLevel: number;
        displayName: string;
        id: string;
        rawDescription: string;
        rawDisplayName: string;
    }

    export type PlayerScores = {
        assists: number;
        creepScore: number;
        deaths: number;
        kills: number;
        wardScore: number;
    }

    export type LiveClientSummonerSpell = {
        displayName: string;
        rawDescription: string;
        rawDisplayName: string;
    }

    export type AllGameData = {
        activePlayer: LocalPlayer,
        allPlayers: Player[],
        events: {
            Events: Event[]
        },
        gameData: GameStats
    }

    export type Event = (GameStartEvent | MinionsSpawningEvent | FirstBloodEvent | FirstBrickEvent | TurretKilledEvent | InhibKilledEvent | InhibRespawnedEvent | DragonKillEvent | HordeKillEvent | HeraldKillEvent | BaronKillEvent | ChampionKillEvent | MultikillEvent | AceEvent | GameEndEvent)

    export type EventBase = {
        EventID: number;
        EventTime: number;
    }

    export type GameStartEvent = {
        EventName: "GameStart"
    } & EventBase

    export type MinionsSpawningEvent = {
        EventName: "MinionsSpawning"
    } & EventBase

    export type FirstBloodEvent = {
        EventName: "FirstBlood",
        Recipient: string
    } & EventBase

    /** First turret destroyed */
    export type FirstBrickEvent = {
        EventName: "FirstBrick",
        KillerName: string
    } & EventBase

    export type TurretKilledEvent = {
        EventName: "TurretKilled"
        TurretKilled: string,
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type InhibKilledEvent = {
        EventName: "InhibKilled",
        InhibKilled: string,
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type InhibRespawnedEvent = {
        EventName: "InhibRespawned",
        InhibRespawned: string
    } & EventBase

    export type DragonKillEvent = {
        EventName: "DragonKill",
        /** "Fire", "Earth", "Water", "Air", "Hextech", "Chemtech", "Elder" */
        DragonType: "Fire" | "Earth" | "Water" | "Air" | "Hextech" | "Chemtech" | "Elder",
        Stolen: BooleanString
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type HordeKillEvent = {
        EventName: "HordeKill",
        Stolen: BooleanString
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type HeraldKillEvent = {
        EventName: "HeraldKill",
        Stolen: BooleanString
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type BaronKillEvent = {
        EventName: "BaronKill",
        Stolen: BooleanString
        KillerName: string,
        Assisters: string[]
    } & EventBase

    export type ChampionKillEvent = {
        EventName: "ChampionKill",
        KillerName: string,
        VictimName: string,
        Assisters: string[]
    } & EventBase

    export type MultikillEvent = {
        EventName: "Multikill",
        KillerName: string,
        KillStreak: number
    } & EventBase

    export type AceEvent = {
        EventName: "Ace",
        Acer: string,
        /** "ORDER" (Blue) or "CHAOS" (Red) */
        AcingTeam: Team
    } & EventBase

    export type GameEndEvent = {
        EventName: "GameEnd",
        Result: string
    } & EventBase
}

const RIOT_GAMES_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
XWehWA==
-----END CERTIFICATE-----`;

const axiosInstance = axios.create({
    baseURL: "https://localhost:2999",
    httpsAgent: new Agent({ ca: RIOT_GAMES_CERTIFICATE })
});

let eventAPIInterval: NodeJS.Timeout | null = null
let consecutiveErrors = 0;
let events: IngameAPI.Event[] = [];
/**
 * Waits for the live client to be available and starts the event api.
 * @param options.timeout The maximum time to wait for the live client to be available. Default is 30 seconds.
 * @param options.pollIntervalMs The interval in milliseconds to poll the live client for new events. Default is 1000ms.
 * @param options.cert The certificate to use for the connection. If not provided, the default Riot Games certificate is used. If null is provided, certificate validation is disabled.
 */
async function startEventAPI(options?: { timeout?: number, pollIntervalMs?: number, cert?: string | null }) {
    consecutiveErrors = 0;
    events = [];
    eventAPIInterval = null;
    axiosInstance.defaults.httpsAgent = new Agent({ ca: options?.cert !== null ? options?.cert ?? RIOT_GAMES_CERTIFICATE : undefined, rejectUnauthorized: options?.cert !== null });

    await waitForLiveClientAvailability(options?.timeout);
    EVENT_EMITTER.emit("started");
    eventAPIInterval = setInterval(async () => {
        const liveClientEvents = await getLiveClientEvents();
        if (liveClientEvents === null) {
            consecutiveErrors++;
            if (consecutiveErrors >= 3)
                stopEventAPI();
        } else {
            liveClientEvents.Events
                .filter(e => !events.some(ev => ev.EventID === e.EventID))
                .sort((a, b) => a.EventTime - b.EventTime)
                .forEach(e => onLiveClientEvent(e));
        }
    }, options?.pollIntervalMs ?? 1000);
}

/** Can be called to stop the Event API. Automatically called if the connection is lost. */
function stopEventAPI() {
    if (eventAPIInterval !== null) {
        clearInterval(eventAPIInterval);
        eventAPIInterval = null;
    }

    consecutiveErrors = 0;
    events = [];

    EVENT_EMITTER.emit("stopped");
}

const EVENT_EMITTER = new TypedEmitter<{
    "started": () => void,
    "stopped": () => void,
    "event": (event: IngameAPI.Event) => void,
    "error": (error?: any) => void,
    "game-started": (event: IngameAPI.GameStartEvent) => void,
    "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void,
    "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void,
    "turret-destroyed": (event: IngameAPI.TurretKilledEvent & { StructureData: ReturnType<typeof extractStructureDataFromName> }) => void,
    "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & { StructureData: ReturnType<typeof extractStructureDataFromName> }) => void,
    "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & { StructureData: ReturnType<typeof extractStructureDataFromName> }) => void,
    "dragon-killed": (event: IngameAPI.DragonKillEvent) => void,
    "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void,
    "herald-killed": (event: IngameAPI.HeraldKillEvent) => void,
    "baron-killed": (event: IngameAPI.BaronKillEvent) => void,
    "champion-killed": (event: IngameAPI.ChampionKillEvent) => void,
    "multikill": (event: IngameAPI.MultikillEvent) => void,
    "ace": (event: IngameAPI.AceEvent) => void
    "game-ended": (event: IngameAPI.GameEndEvent) => void
}>();

function onLiveClientEvent(event: IngameAPI.Event) {
    events.push(event);

    EVENT_EMITTER.emit("event", event);
    switch (event.EventName) {
        case "GameStart":
            EVENT_EMITTER.emit("game-started", event);
            break;
        case "MinionsSpawning":
            EVENT_EMITTER.emit("minions-spawning", event);
            break;
        case "FirstBrick":
            EVENT_EMITTER.emit("first-turret-destroyed", event);
            break;
        case "TurretKilled":
            EVENT_EMITTER.emit("turret-destroyed", { ...event, StructureData: extractStructureDataFromName(event.TurretKilled) });
            break;
        case "InhibKilled":
            EVENT_EMITTER.emit("inhibitor-destroyed", { ...event, StructureData: extractStructureDataFromName(event.InhibKilled) });
            break;
        case "InhibRespawned":
            EVENT_EMITTER.emit("inhibitor-respawned", { ...event, StructureData: extractStructureDataFromName(event.InhibRespawned) });
            break;
        case "DragonKill":
            EVENT_EMITTER.emit("dragon-killed", event);
            break;
        case "HordeKill":
            EVENT_EMITTER.emit("void-grub-killed", event);
            break;
        case "HeraldKill":
            EVENT_EMITTER.emit("herald-killed", event);
            break;
        case "BaronKill":
            EVENT_EMITTER.emit("baron-killed", event);
            break;
        case "ChampionKill":
            EVENT_EMITTER.emit("champion-killed", event);
            break;
        case "Multikill":
            EVENT_EMITTER.emit("multikill", event);
            break;
        case "Ace":
            EVENT_EMITTER.emit("ace", event);
            break;
        case "GameEnd":
            EVENT_EMITTER.emit("game-ended", event);
            break;
    }
}

function extractStructureDataFromName(name: string) {
    const [_type, _team, _lane, _turretPos] = name.split("_");

    return {
        name,
        type: _type === "Barracks" ? "Inhibitor" : _type,
        team: _team === "T1" ? "Blue" : "Red",
        lane: _lane[0] === "L" ? "Top" : _lane[0] === "C" ? "Middle" : "Bottom",
        position: _type === "Barracks" ? _lane[1] : _turretPos ?? -1
    } as { name: string, type: "Turret" | "Inhibitor", team: "Blue" | "Red", lane: "Top" | "Middle" | "Bottom" }
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function waitForLiveClientAvailability(timeout = 30000) {
    let elapsedTime = 0;
    while (elapsedTime < timeout) {
        let summonerName = await getLiveClientActivePlayerSummonerName();
        if (summonerName !== null)
            return;

        elapsedTime += 1000;
        if (elapsedTime < timeout)
            await delay(1000);
    }

    throw new Error(`Ingame API not available after ${timeout}ms.`);
}

async function getLiveClientActivePlayerSummonerName() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayername" }).then(res => res.data as string, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    });
}

async function getLiveClientData(): Promise<IngameAPI.AllGameData | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/allgamedata" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientActivePlayer(): Promise<IngameAPI.LocalPlayer | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayer" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientActivePlayerAbilities(): Promise<IngameAPI.LocalPlayerAbilities | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayerabilities" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientActivePlayerRunes(): Promise<IngameAPI.LocalPlayerRunes | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayerrunes" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientPlayerList(): Promise<IngameAPI.Player[] | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playerlist" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientPlayerScore(summonerName: string): Promise<IngameAPI.PlayerScores | null> {
    return await axiosInstance({ method: "get", url: encodeURI("/liveclientdata/playerscores?summonerName=" + summonerName) }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientPlayerSummonerSpells(summonerName: string): Promise<IngameAPI.PlayerSummonerSpells | null> {
    return await axiosInstance({ method: "get", url: encodeURI("/liveclientdata/playersummonerspells?summonerName=" + summonerName) }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientPlayerMainRunes(summonerName: string): Promise<IngameAPI.PlayerMainRunes | null> {
    return await axiosInstance({ method: "get", url: encodeURI("/liveclientdata/playermainrunes?summonerName=" + summonerName) }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientPlayerItems(summonerName: string): Promise<IngameAPI.PlayerItem[] | null> {
    return await axiosInstance({ method: "get", url: encodeURI("/liveclientdata/playeritems?summonerName=" + summonerName) }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientEvents(): Promise<{ Events: IngameAPI.Event[] } | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/eventdata" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

async function getLiveClientGameStats(): Promise<IngameAPI.GameStats | null> {
    return await axiosInstance({ method: "get", url: "/liveclientdata/gamestats" }).then(res => res.data, err => {
        EVENT_EMITTER.emit("error", err);
        return null;
    })
}

const IngameAPI = {
    /** Base url is set */
    request: axiosInstance.request.bind(axiosInstance),

    CERTIFICATE: RIOT_GAMES_CERTIFICATE,
    /** Change the trusted certificate or disable verification by passing null. If this is never called, then the included certificate is used. */
    setCertificate: (cert: string | null) => axiosInstance.defaults.httpsAgent = cert !== null ? new Agent({ ca: cert }) : new Agent({ rejectUnauthorized: false }),

    startEventAPI,
    stopEventAPI,

    on: EVENT_EMITTER.on.bind(EVENT_EMITTER),
    once: EVENT_EMITTER.once.bind(EVENT_EMITTER),
    off: EVENT_EMITTER.off.bind(EVENT_EMITTER),

    getLiveClientData,
    getLiveClientActivePlayer,
    getLiveClientActivePlayerAbilities,
    getLiveClientActivePlayerRunes,
    getLiveClientPlayerList,
    getLiveClientPlayerScore,
    getLiveClientPlayerSummonerSpells,
    getLiveClientPlayerMainRunes,
    getLiveClientPlayerItems,
    getLiveClientEvents,
    getLiveClientGameStats,
    getLiveClientActivePlayerSummonerName,
} as const;

export default IngameAPI;