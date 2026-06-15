import { TypedEmitter } from "tiny-typed-emitter";
import axios from "axios";
import { Agent } from "https";
declare enum Team {
    Blue = "ORDER",
    Red = "CHAOS"
}
type BooleanString = "True" | "False";
declare namespace IngameAPI {
    type LocalPlayerAbilities = {
        Passive: LiveClientPassiveAbility;
        Q: LiveClientAbility;
        W: LiveClientAbility;
        E: LiveClientAbility;
        R: LiveClientAbility;
    };
    type LocalPlayer = {
        abilities: LocalPlayerAbilities;
        championStats: LiveClientChampionStats;
        currentGold: number;
        fullRunes: LocalPlayerRunes;
        level: number;
        /** Same as riotId */
        summonerName: string;
        riotId: string;
        riotIdGameName: string;
        riotIdTagLine: string;
        teamRelativeColors: boolean;
    };
    type LocalPlayerRunes = {
        keystone: LiveClientKeystone;
        primaryRuneTree: LiveClientRuneTree;
        secondaryRuneTree: LiveClientRuneTree;
        generalRunes: LiveClientRuneTree[];
        statRunes: LiveClientStatRune[];
    };
    type LiveClientStatRune = {
        id: number;
        rawDescription: string;
    };
    type LiveClientChampionStats = {
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
    };
    type LiveClientRuneTree = {
        displayName: string;
        id: number;
        rawDescription: string;
        rawDisplayName: string;
    };
    type LiveClientKeystone = {
        displayName: string;
        id: number;
        rawDescription: string;
        rawDisplayName: string;
    };
    type GameStats = {
        gameMode: string;
        gameTime: number;
        mapName: string;
        mapNumber: number;
        mapTerrain: string;
    };
    type Player = {
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
        riotId: string;
        riotIdGameName: string;
        riotIdTagLine: string;
    };
    type PlayerMainRunes = {
        keystone: LiveClientKeystone;
        primaryRuneTree: LiveClientRuneTree;
        secondaryRuneTree: LiveClientRuneTree;
    };
    type PlayerSummonerSpells = {
        summonerSpellOne: LiveClientSummonerSpell;
        summonerSpellTwo: LiveClientSummonerSpell;
    };
    type PlayerItem = {
        canUse: boolean;
        consumable: boolean;
        count: number;
        displayName: string;
        itemID: number;
        price: number;
        rawDescription: string;
        rawDisplayName: string;
        slot: number;
    };
    type LiveClientPassiveAbility = {
        displayName: string;
        id: string;
        rawDescription: string;
        rawDisplayName: string;
    };
    type LiveClientAbility = {
        abilityLevel: number;
        displayName: string;
        id: string;
        rawDescription: string;
        rawDisplayName: string;
    };
    type PlayerScores = {
        assists: number;
        creepScore: number;
        deaths: number;
        kills: number;
        wardScore: number;
    };
    type LiveClientSummonerSpell = {
        displayName: string;
        rawDescription: string;
        rawDisplayName: string;
    };
    type AllGameData = {
        activePlayer: LocalPlayer;
        allPlayers: Player[];
        events: {
            Events: Event[];
        };
        gameData: GameStats;
    };
    type Event = (GameStartEvent | MinionsSpawningEvent | FirstBloodEvent | FirstBrickEvent | TurretKilledEvent | InhibKilledEvent | InhibRespawnedEvent | DragonKillEvent | HordeKillEvent | HeraldKillEvent | BaronKillEvent | ChampionKillEvent | MultikillEvent | AceEvent | GameEndEvent);
    type EventBase = {
        EventID: number;
        EventTime: number;
    };
    type GameStartEvent = {
        EventName: "GameStart";
    } & EventBase;
    type MinionsSpawningEvent = {
        EventName: "MinionsSpawning";
    } & EventBase;
    type FirstBloodEvent = {
        EventName: "FirstBlood";
        Recipient: string;
    } & EventBase;
    /** First turret destroyed */
    type FirstBrickEvent = {
        EventName: "FirstBrick";
        KillerName: string;
    } & EventBase;
    type TurretKilledEvent = {
        EventName: "TurretKilled";
        TurretKilled: string;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type InhibKilledEvent = {
        EventName: "InhibKilled";
        InhibKilled: string;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type InhibRespawnedEvent = {
        EventName: "InhibRespawned";
        InhibRespawned: string;
    } & EventBase;
    type DragonKillEvent = {
        EventName: "DragonKill";
        /** "Fire", "Earth", "Water", "Air", "Hextech", "Chemtech", "Elder" */
        DragonType: "Fire" | "Earth" | "Water" | "Air" | "Hextech" | "Chemtech" | "Elder";
        Stolen: BooleanString;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type HordeKillEvent = {
        EventName: "HordeKill";
        Stolen: BooleanString;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type HeraldKillEvent = {
        EventName: "HeraldKill";
        Stolen: BooleanString;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type BaronKillEvent = {
        EventName: "BaronKill";
        Stolen: BooleanString;
        KillerName: string;
        Assisters: string[];
    } & EventBase;
    type ChampionKillEvent = {
        EventName: "ChampionKill";
        KillerName: string;
        VictimName: string;
        Assisters: string[];
    } & EventBase;
    type MultikillEvent = {
        EventName: "Multikill";
        KillerName: string;
        KillStreak: number;
    } & EventBase;
    type AceEvent = {
        EventName: "Ace";
        Acer: string;
        /** "ORDER" (Blue) or "CHAOS" (Red) */
        AcingTeam: Team;
    } & EventBase;
    type GameEndEvent = {
        EventName: "GameEnd";
        Result: string;
    } & EventBase;
}
/**
 * Waits for the live client to be available and starts the event api.
 * @param options.timeout The maximum time to wait for the live client to be available. Default is 30 seconds.
 * @param options.pollIntervalMs The interval in milliseconds to poll the live client for new events. Default is 1000ms.
 * @param options.cert The certificate to use for the connection. If not provided, the default Riot Games certificate is used. If null is provided, certificate validation is disabled.
 */
declare function startEventAPI(options?: {
    timeout?: number;
    pollIntervalMs?: number;
    cert?: string | null;
}): Promise<void>;
/** Can be called to stop the Event API. Automatically called if the connection is lost. */
declare function stopEventAPI(): void;
declare function extractStructureDataFromName(name: string): {
    name: string;
    type: "Turret" | "Inhibitor";
    team: "Blue" | "Red";
    lane: "Top" | "Middle" | "Bottom";
};
declare function waitForLiveClientAvailability(timeout?: number): Promise<void>;
declare function getActivePlayerRiotId(): Promise<string | null>;
declare function getAllGameData(): Promise<IngameAPI.AllGameData | null>;
declare function getActivePlayer(): Promise<IngameAPI.LocalPlayer | null>;
declare function getActivePlayerAbilities(): Promise<IngameAPI.LocalPlayerAbilities | null>;
declare function getActivePlayerRunes(): Promise<IngameAPI.LocalPlayerRunes | null>;
declare function getPlayerList(): Promise<IngameAPI.Player[] | null>;
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
declare function getPlayerScores(riotId: string): Promise<IngameAPI.PlayerScores | null>;
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
declare function getPlayerSummonerSpells(riotId: string): Promise<IngameAPI.PlayerSummonerSpells | null>;
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
declare function getPlayerMainRunes(riotId: string): Promise<IngameAPI.PlayerMainRunes | null>;
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
declare function getPlayerItems(riotId: string): Promise<IngameAPI.PlayerItem[] | null>;
declare function getEvents(): Promise<{
    Events: IngameAPI.Event[];
} | null>;
declare function getGameStats(): Promise<IngameAPI.GameStats | null>;
declare const IngameAPI: {
    /** Base url is set */
    readonly request: <T = any, R = axios.AxiosResponse<T, any, {}>, D = any>(config: axios.AxiosRequestConfig<D>) => Promise<R>;
    readonly CERTIFICATE: "-----BEGIN CERTIFICATE-----\nMIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC\nVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET\nMBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp\nbmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1\ndGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft\nZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV\nBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p\nY2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu\nZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0\nZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv\ndGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/\n6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj\n21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv\nJNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC\ny+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr\nZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX\n8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs\nlcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k\nWObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO\nq3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP\nSvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5\nEcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L\nXWehWA==\n-----END CERTIFICATE-----";
    /** Change the trusted certificate or disable verification by passing null. If this is never called, then the included certificate is used. */
    readonly setCertificate: (cert: string | null) => Agent;
    readonly startEventAPI: typeof startEventAPI;
    readonly stopEventAPI: typeof stopEventAPI;
    readonly on: <U extends "error" | "stopped" | "event" | "started" | "game-started" | "minions-spawning" | "first-turret-destroyed" | "turret-destroyed" | "inhibitor-destroyed" | "inhibitor-respawned" | "dragon-killed" | "void-grub-killed" | "herald-killed" | "baron-killed" | "champion-killed" | "multikill" | "ace" | "game-ended">(event: U, listener: {
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }[U]) => TypedEmitter<{
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }>;
    readonly once: <U extends "error" | "stopped" | "event" | "started" | "game-started" | "minions-spawning" | "first-turret-destroyed" | "turret-destroyed" | "inhibitor-destroyed" | "inhibitor-respawned" | "dragon-killed" | "void-grub-killed" | "herald-killed" | "baron-killed" | "champion-killed" | "multikill" | "ace" | "game-ended">(event: U, listener: {
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }[U]) => TypedEmitter<{
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }>;
    readonly off: <U extends "error" | "stopped" | "event" | "started" | "game-started" | "minions-spawning" | "first-turret-destroyed" | "turret-destroyed" | "inhibitor-destroyed" | "inhibitor-respawned" | "dragon-killed" | "void-grub-killed" | "herald-killed" | "baron-killed" | "champion-killed" | "multikill" | "ace" | "game-ended">(event: U, listener: {
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }[U]) => TypedEmitter<{
        started: () => void;
        stopped: () => void;
        event: (event: IngameAPI.Event) => void;
        error: (error?: any) => void;
        "game-started": (event: IngameAPI.GameStartEvent) => void;
        "minions-spawning": (event: IngameAPI.MinionsSpawningEvent) => void;
        "first-turret-destroyed": (event: IngameAPI.FirstBrickEvent) => void;
        "turret-destroyed": (event: IngameAPI.TurretKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-destroyed": (event: IngameAPI.InhibKilledEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "inhibitor-respawned": (event: IngameAPI.InhibRespawnedEvent & {
            StructureData: ReturnType<typeof extractStructureDataFromName>;
        }) => void;
        "dragon-killed": (event: IngameAPI.DragonKillEvent) => void;
        "void-grub-killed": (event: IngameAPI.HordeKillEvent) => void;
        "herald-killed": (event: IngameAPI.HeraldKillEvent) => void;
        "baron-killed": (event: IngameAPI.BaronKillEvent) => void;
        "champion-killed": (event: IngameAPI.ChampionKillEvent) => void;
        multikill: (event: IngameAPI.MultikillEvent) => void;
        ace: (event: IngameAPI.AceEvent) => void;
        "game-ended": (event: IngameAPI.GameEndEvent) => void;
    }>;
    readonly waitForLiveClientAvailability: typeof waitForLiveClientAvailability;
    readonly getAllGameData: typeof getAllGameData;
    readonly getActivePlayer: typeof getActivePlayer;
    readonly getActivePlayerAbilities: typeof getActivePlayerAbilities;
    readonly getActivePlayerRunes: typeof getActivePlayerRunes;
    readonly getPlayerList: typeof getPlayerList;
    readonly getPlayerScores: typeof getPlayerScores;
    readonly getPlayerSummonerSpells: typeof getPlayerSummonerSpells;
    readonly getPlayerMainRunes: typeof getPlayerMainRunes;
    readonly getPlayerItems: typeof getPlayerItems;
    readonly getEvents: typeof getEvents;
    readonly getGameStats: typeof getGameStats;
    readonly getActivePlayerRiotId: typeof getActivePlayerRiotId;
};
export default IngameAPI;
