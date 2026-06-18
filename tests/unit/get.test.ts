import { describe, it, expect, vi, afterEach } from "vitest";
import { AxiosError } from "axios";

// Control the axios instance the module builds at import time. We keep the real `isAxiosError`
// (via `...actual.default`) so the module's expected-absence classification sees genuine AxiosErrors,
// and only replace `create` so every getter routes through our mock `get`.
const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  const instance = {
    get: mockGet,
    request: vi.fn(),
    interceptors: { response: { use: vi.fn() } },
    defaults: {} as Record<string, unknown>,
  };
  return { ...actual, default: { ...actual.default, create: () => instance } };
});

import { IngameAPI } from "../../index";

function axiosErrorWithStatus(status: number): AxiosError {
  const error = new AxiosError(`HTTP ${status}`, "ERR_BAD_RESPONSE");
  (error as { response?: unknown }).response = { status };
  return error;
}

// Tracks "error" listeners so each test starts from a clean emitter (IngameAPI is a module singleton).
let attachedErrorListeners: ((error?: unknown) => void)[] = [];
function onError(listener: (error?: unknown) => void) {
  attachedErrorListeners.push(listener);
  IngameAPI.on("error", listener);
}

afterEach(() => {
  attachedErrorListeners.forEach(listener => IngameAPI.off("error", listener));
  attachedErrorListeners = [];
  mockGet.mockReset();
});

describe("Live Client Data getters — success", () => {
  it("returns the parsed response body", async () => {
    mockGet.mockResolvedValueOnce({ data: "Faker#KR1" });
    await expect(IngameAPI.getActivePlayerRiotId()).resolves.toBe("Faker#KR1");
  });
});

describe("Live Client Data getters — expected absences return null without emitting", () => {
  it("treats ECONNREFUSED (not in a game) as null", async () => {
    const listener = vi.fn();
    onError(listener);
    mockGet.mockRejectedValueOnce(new AxiosError("refused", "ECONNREFUSED"));

    await expect(IngameAPI.getActivePlayer()).resolves.toBeNull();
    expect(listener).not.toHaveBeenCalled();
  });

  it("treats a 404 (data not ready) as null", async () => {
    const listener = vi.fn();
    onError(listener);
    mockGet.mockRejectedValueOnce(axiosErrorWithStatus(404));

    await expect(IngameAPI.getAllGameData()).resolves.toBeNull();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("Live Client Data getters — genuine faults surface via the error event", () => {
  it("emits 'error' with the fault on a 5xx and still resolves null", async () => {
    const listener = vi.fn();
    onError(listener);
    const fault = axiosErrorWithStatus(500);
    mockGet.mockRejectedValueOnce(fault);

    await expect(IngameAPI.getAllGameData()).resolves.toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(fault);
  });

  it("treats a non-Axios error (e.g. a parse failure) as a fault", async () => {
    const listener = vi.fn();
    onError(listener);
    mockGet.mockRejectedValueOnce(new Error("Unexpected token in JSON"));

    await expect(IngameAPI.getGameStats()).resolves.toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not throw on a fault when no error listener is attached", async () => {
    // Regression guard: TypedEmitter is Node's EventEmitter, which throws on an unhandled "error"
    // event. A standalone getter call with no error listener must stay non-fatal.
    mockGet.mockRejectedValueOnce(axiosErrorWithStatus(500));
    await expect(IngameAPI.getActivePlayer()).resolves.toBeNull();
  });
});
