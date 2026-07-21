// Fields common to every message, regardless of kind.
type MessageBase = {
  mine: boolean;
  time: string;
  user_id?: string;
  username?: string;
  owner?: boolean;
};

export type Message = MessageBase &
  (
    | { kind: "text"; text: string }
    | { kind: "file"; name: string }
    | { kind: "video"; src: string; duration: string }
    | { kind: "audio" }
    | { kind: "grid"; images: string[]; extra?: number }
  );

// Server payload for the "message" event (see apps/server/src/index.ts).
export type IncomingMessage = { text: string; at: number };
