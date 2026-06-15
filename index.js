"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const axios_1 = __importDefault(require("axios"));
const https_1 = require("https");
var Team;
(function (Team) {
    Team["Blue"] = "ORDER";
    Team["Red"] = "CHAOS";
})(Team || (Team = {}));
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
const axiosInstance = axios_1.default.create({
    baseURL: "https://127.0.0.1:2999",
    httpsAgent: new https_1.Agent({ ca: RIOT_GAMES_CERTIFICATE })
});
let eventAPIInterval = null;
let consecutiveErrors = 0;
let events = [];
let playerEventEmitters = {};
var isEventAPIRunning = false;
/**
 * Waits for the live client to be available and starts the event api.
 * @param options.timeout The maximum time to wait for the live client to be available. Default is 30 seconds.
 * @param options.pollIntervalMs The interval in milliseconds to poll the live client for new events. Default is 1000ms.
 * @param options.cert The certificate to use for the connection. If not provided, the default Riot Games certificate is used. If null is provided, certificate validation is disabled.
 */
async function startEventAPI(options) {
    if (isEventAPIRunning)
        return;
    isEventAPIRunning = true;
    consecutiveErrors = 0;
    events = [];
    eventAPIInterval = null;
    axiosInstance.defaults.httpsAgent = new https_1.Agent({ ca: options?.cert !== null ? options?.cert ?? RIOT_GAMES_CERTIFICATE : undefined, rejectUnauthorized: options?.cert !== null });
    await waitForLiveClientAvailability(options?.timeout).catch((err) => { isEventAPIRunning = false; throw err; });
    EVENT_EMITTER.emit("started");
    eventAPIInterval = setInterval(async () => {
        const liveClientEvents = await getEvents();
        if (liveClientEvents === null) {
            consecutiveErrors++;
            if (consecutiveErrors >= 3)
                stopEventAPI();
        }
        else {
            liveClientEvents.Events
                .filter(e => !events.some(ev => ev.EventID === e.EventID))
                .sort((a, b) => a.EventTime - b.EventTime)
                .forEach(e => onLiveClientEvent(e));
            consecutiveErrors = 0;
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
    isEventAPIRunning = false;
    EVENT_EMITTER.emit("stopped");
}
const EVENT_EMITTER = new tiny_typed_emitter_1.TypedEmitter();
function onLiveClientEvent(event) {
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
function getPlayerEventEmitter(riotId) {
    if (playerEventEmitters[riotId] === undefined)
        playerEventEmitters[riotId] = new tiny_typed_emitter_1.TypedEmitter();
    return playerEventEmitters[riotId];
}
function extractStructureDataFromName(name) {
    const [_type, _team, _lane, _turretPos] = name.split("_");
    return {
        name,
        type: _type === "Barracks" ? "Inhibitor" : _type,
        team: _team === "T1" ? "Blue" : "Red",
        lane: _lane[0] === "L" ? "Top" : _lane[0] === "C" ? "Middle" : "Bottom",
        position: _type === "Barracks" ? _lane[1] : _turretPos ?? -1
    };
}
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function waitForLiveClientAvailability(timeout = 30000) {
    let elapsedTime = 0;
    while (elapsedTime < timeout) {
        let summonerName = await getActivePlayerRiotId();
        if (summonerName !== null)
            return;
        elapsedTime += 1000;
        if (elapsedTime < timeout)
            await delay(1000);
    }
    throw new Error(`Ingame API not available after ${timeout}ms.`);
}
axiosInstance.interceptors.response.use(res => res, async (err) => {
    return Promise.reject(err); // I have no idea why this is needed, but it is, at least last time I checked
});
async function getActivePlayerRiotId() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayername" }).then(res => res.data, err => { return null; });
}
async function getAllGameData() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/allgamedata" }).then(res => res.data, err => {
        return null;
    });
}
async function getActivePlayer() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayer" }).then(res => res.data, err => {
        return null;
    });
}
async function getActivePlayerAbilities() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayerabilities" }).then(res => res.data, err => {
        return null;
    });
}
async function getActivePlayerRunes() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/activeplayerrunes" }).then(res => res.data, err => {
        return null;
    });
}
async function getPlayerList() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playerlist" }).then(res => res.data, err => {
        return null;
    });
}
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
async function getPlayerScores(riotId) {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playerscores?riotId=" + encodeURIComponent(riotId) }).then(res => res.data, err => {
        return null;
    });
}
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
async function getPlayerSummonerSpells(riotId) {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playersummonerspells?riotId=" + encodeURIComponent(riotId) }).then(res => res.data, err => {
        return null;
    });
}
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
async function getPlayerMainRunes(riotId) {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playermainrunes?riotId=" + encodeURIComponent(riotId) }).then(res => res.data, err => {
        return null;
    });
}
/**
 * @param riotId The full Riot ID of the player or just the name (not recommended since there could be duplicate names)
 */
async function getPlayerItems(riotId) {
    return await axiosInstance({ method: "get", url: "/liveclientdata/playeritems?summonerName=" + encodeURIComponent(riotId) }).then(res => res.data, err => {
        return null;
    });
}
async function getEvents() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/eventdata" }).then(res => res.data, err => {
        return null;
    });
}
async function getGameStats() {
    return await axiosInstance({ method: "get", url: "/liveclientdata/gamestats" }).then(res => res.data, err => {
        return null;
    });
}
const IngameAPI = {
    /** Base url is set */
    request: axiosInstance.request.bind(axiosInstance),
    CERTIFICATE: RIOT_GAMES_CERTIFICATE,
    /** Change the trusted certificate or disable verification by passing null. If this is never called, then the included certificate is used. */
    setCertificate: (cert) => axiosInstance.defaults.httpsAgent = cert !== null ? new https_1.Agent({ ca: cert }) : new https_1.Agent({ rejectUnauthorized: false }),
    startEventAPI,
    stopEventAPI,
    on: EVENT_EMITTER.on.bind(EVENT_EMITTER),
    once: EVENT_EMITTER.once.bind(EVENT_EMITTER),
    off: EVENT_EMITTER.off.bind(EVENT_EMITTER),
    waitForLiveClientAvailability,
    getAllGameData,
    getActivePlayer,
    getActivePlayerAbilities,
    getActivePlayerRunes,
    getPlayerList,
    getPlayerScores,
    getPlayerSummonerSpells,
    getPlayerMainRunes,
    getPlayerItems,
    getEvents,
    getGameStats,
    getActivePlayerRiotId,
};
exports.default = IngameAPI;
