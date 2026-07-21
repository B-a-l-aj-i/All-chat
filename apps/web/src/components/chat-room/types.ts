export type Message =
  | { kind: "text"; mine: boolean; text: string; time: string }
  | { kind: "file"; mine: boolean; name: string; time: string }
  | { kind: "video"; mine: boolean; src: string; duration: string; time: string }
  | { kind: "audio"; mine: boolean; time: string }
  | { kind: "grid"; mine: boolean; images: string[]; extra?: number; time: string };

// Server payload for the "message" event (see apps/server/src/index.ts).
export type IncomingMessage = { text: string; at: number };
