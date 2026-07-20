/**
 * Chat room UI, ported from the Paper design export.
 * https://app.paper.design/file/01KQBT5PKKJT1N5SE4SHE6AKCT/1-0/9TQ-0
 *
 * Visuals (colors, radii, spacing, bubble styles) are kept faithful to the
 * export; the inline SVGs were swapped for lucide-react icons and Paper's
 * fixed artboard widths dropped so it renders as a real, fluid page.
 * Message list and inputs are still the designed static content — wiring them
 * to the socket is the next step.
 */
import {
  CheckCheck,
  CirclePlus,
  Ellipsis,
  File,
  Mic,
  Paperclip,
  Play,
  Search,
  Smile,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";

const AVATAR =
  "https://app.paper.design/file-assets/01KQBT5PKKJT1N5SE4SHE6AKCT/12ECP6AXP7C3CHNTV4ZQ75ZP7H.png";

const FONT = "font-['Inter',system-ui,sans-serif]";

type Message =
  | { kind: "text"; mine: boolean; text: string; time: string }
  | { kind: "file"; mine: boolean; name: string; time: string }
  | { kind: "video"; mine: boolean; src: string; duration: string; time: string }
  | { kind: "audio"; mine: boolean; time: string }
  | { kind: "grid"; mine: boolean; images: string[]; extra?: number; time: string };

// Server payload for the "message" event (see apps/server/src/index.ts).
type IncomingMessage = { text: string; at: number };

const formatTime = (at: number) =>
  new Date(at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function Avatar() {
  return (
    <div className="h-11.25 flex shrink-0 w-11.25 rounded-full relative">
      <div
        className="aspect-square max-w-full overflow-clip bg-cover bg-position-[50%] bg-no-repeat size-full rounded-full"
        style={{ backgroundImage: `url(${AVATAR})` }}
      />
      <div className="h-[11.25px] bottom-0 w-[11.25px] right-0 absolute rounded-full bg-[#4ADE80]" />
    </div>
  );
}

function MoreButton() {
  return (
    <div className="items-center h-[37.5px] inline-flex justify-center py-[7.5px] px-3.75 rounded-[5.5px]">
      <Ellipsis size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
    </div>
  );
}

function Timestamp({ time, mine }: { time: string; mine: boolean }) {
  return (
    <div className={`items-center flex gap-[7.5px] ${mine ? "justify-end" : ""}`}>
      <div className={`mt-[3.75px] content-center ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}>
        {time}
      </div>
      {mine && <CheckCheck size={15} className="text-[#22C55E] shrink-0" strokeWidth={2} />}
    </div>
  );
}

const bubbleShell =
  "rounded-[7.5px] [box-shadow:#0000000D_0px_1px_2px] bg-white border border-solid border-[#E7E5E4]";

function MessageBody({ message }: { message: Message }) {
  switch (message.kind) {
    case "text":
      return (
        <div className={bubbleShell}>
          <div className="inline-flex p-3.75">
            <div className={`inline-block text-[15px] leading-[150%] ${FONT} text-[#0C0A09]`}>
              {message.text}
            </div>
          </div>
        </div>
      );
    case "file":
      return (
        <div className={bubbleShell}>
          <div className="items-center inline-flex p-3.75">
            <File
              size={30}
              className="text-[#0C0A09] opacity-50 shrink-0 mr-[15px]"
              strokeWidth={1.5}
            />
            <div className="flex flex-col gap-[7.5px]">
              <div className={`text-[15px] leading-[150%] ${FONT} text-[#0C0A09]`}>
                {message.name}
              </div>
              <div className="flex gap-[7.5px]">
                {["Download", "Preview"].map((label) => (
                  <div
                    key={label}
                    className="items-center h-[33.75px] flex justify-center px-[11.25px] rounded-[5.5px] bg-white border border-solid border-[#E7E5E4]"
                  >
                    <div className={`flex text-center w-max shrink-0 ${FONT} font-medium text-[#0C0A09] text-[13.125px]/[18.75px]`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case "video":
      return (
        <div
          className="items-center self-start aspect-[4/3] flex shrink-0 w-48.75 justify-center rounded-[7.5px] relative bg-cover bg-position-[50%]"
          style={{ backgroundImage: `url(${message.src})` }}
        >
          <Play size={30} className="shrink-0" strokeWidth={2} stroke="rgb(255 255 255 / 80%)" fill="none" />
          <div className={`top-[7.5px] right-[7.5px] absolute ${FONT} font-semibold text-[#FFFFFF99] text-[11.25px]/3.75`}>
            {message.duration}
          </div>
        </div>
      );
    case "audio":
      return (
        <div className={`items-center flex justify-center ${bubbleShell}`}>
          <div className="flex p-3.75 gap-3.75">
            <div className="h-13.5 w-75 shrink-0" />
          </div>
        </div>
      );
    case "grid":
      return (
        <div className={`items-center flex justify-center ${bubbleShell}`}>
          <div className="flex p-3.75 gap-3.75">
            <div className="grid grid-cols-2 gap-[7.5px]">
              {message.images.map((src, i) => {
                const isLast = i === message.images.length - 1;
                return (
                  <div key={src} className="rounded-[7.5px] overflow-clip relative">
                    <div
                      className="aspect-[4/3] max-w-full w-68.5 h-[205.5px] overflow-clip bg-cover bg-position-[50%]"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                    {isLast && message.extra ? (
                      <div className="items-center flex justify-center absolute bg-[#00000066] inset-0">
                        <div className={`flex ${FONT} font-semibold text-white text-[28.125px]/[33.75px]`}>
                          +{message.extra}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
  }
}

function MessageRow({ message }: { message: Message }) {
  const { mine } = message;
  return (
    <div className={`mt-[37.5px] max-w-160 first:mt-0 ${mine ? "self-end" : ""}`}>
      <div className="items-center flex gap-[7.5px]">
        {mine && <MoreButton />}
        <div className={mine ? "order-1" : ""}>
          <MessageBody message={message} />
        </div>
        {!mine && <MoreButton />}
      </div>
      <Timestamp time={message.time} mine={mine} />
    </div>
  );
}

function SidebarRoom({ name, active }: { name: string; active?: boolean }) {
  return (
    <div className={`items-center flex py-3.75 px-[22.5px] gap-3.75 ${active ? "bg-[#E5E7EB]" : "bg-white"}`}>
      <Avatar />
      <div className="grow min-w-0">
        <div className="flex justify-between">
          <div className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09]`}>
            {name}
          </div>
        </div>
        <div className="items-center flex gap-[7.5px]">
          <div className="items-center h-[22.5px] flex shrink-0 w-[22.5px] justify-center ml-auto rounded-full bg-[#22C55E]">
            <div className={`flex ${FONT} text-white text-[13.125px]/[18.75px]`}>8</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatRoom({
  roomId,
  onLeave,
}: {
  roomId: string;
  onLeave?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Receive messages from other members of the room.
  useEffect(() => {
    const onMessage = (payload: IncomingMessage | string) => {
      const text = typeof payload === "string" ? payload : payload?.text;
      if (!text) return;
      const at = typeof payload === "string" ? Date.now() : payload.at;
      setMessages((prev) => [
        ...prev,
        { kind: "text", mine: false, text, time: formatTime(at) },
      ]);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    socket.emit("message", { roomId, text });
    setMessages((prev) => [
      ...prev,
      { kind: "text", mine: true, text, time: formatTime(Date.now()) },
    ]);
    setDraft("");
  };

  return (
    <div className="[font-synthesis:none] h-full p-11.25 bg-[#F5F5F4] antialiased text-xs/4 overflow-hidden">
      <div className="flex gap-7.5 h-full">
        {/* Sidebar */}
        <div className="w-90 shrink-0 h-full">
          <div className={`flex flex-col h-full ${bubbleShell}`}>
            <div className="flex flex-col p-[22.5px]">
              <div className="items-center flex justify-between">
                <div className={`text-[22.5px] [letter-spacing:-0.5625px] leading-[100%] ${FONT} font-bold text-[#0C0A09]`}>
                  Chats
                </div>
                <div className="items-center h-[37.5px] flex justify-center py-[7.5px] px-3.75 rounded-[5.5px] bg-white border border-solid border-[#E7E5E4]">
                  <CirclePlus size={15} className="text-[#0C0A09] shrink-0 mr-[7.5px]" strokeWidth={2} />
                  <div className={`inline-block text-center w-max shrink-0 ${FONT} font-medium text-[#0C0A09] text-[13.125px]/[18.75px]`}>
                    New
                  </div>
                </div>
              </div>
            </div>
            <div className="items-center flex py-[11.25px] px-[22.5px] relative">
              <div className="h-[37.5px] flex w-full items-center pr-[11.25px] pl-[37.5px] rounded-[5.5px] overflow-clip py-[7.5px] bg-white border border-solid border-[#E7E5E4]">
                <input
                  className={`flex-1 min-w-0 bg-transparent outline-none ${FONT} text-[#78716C] text-[13.125px]/4 placeholder:text-[#78716C]`}
                  placeholder="Chats search..."
                />
              </div>
              <Search size={15} className="text-[#78716C] left-[37.5px] absolute" strokeWidth={2} />
            </div>
            <div className="flex-1 min-h-0 pt-3.75 overflow-y-auto">
              <SidebarRoom name={roomId} active />
              <SidebarRoom name="Room Serious" />
              <SidebarRoom name="Room Serious" />
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="grow flex flex-col min-w-0">
          <div className="flex justify-between gap-3.75">
            <div className="flex gap-3.75">
              <Avatar />
              <div className="flex flex-col">
                <div className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09]`}>
                  {roomId}
                </div>
                <div className={`${FONT} text-[#22C55E] text-[13.125px]/[18.75px]`}>Online</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onLeave}
              aria-label="Leave room"
              className="items-center h-[37.5px] flex w-[37.5px] justify-center rounded-[5.5px] shrink-0 cursor-pointer hover:bg-[#E5E7EB]"
            >
              <Ellipsis size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 min-h-0 w-full py-3.75 overflow-hidden relative">
            <div ref={scrollRef} className="overflow-y-auto size-full">
              <div className="flex flex-col items-start py-7.5">
                {messages.length === 0 ? (
                  <div className={`w-full text-center ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}>
                    No messages yet — say something to start the conversation.
                  </div>
                ) : (
                  messages.map((message, i) => (
                    <MessageRow key={i} message={message} />
                  ))
                )}
              </div>
            </div>
            <div
              className="h-12.5 top-0 absolute inset-x-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(in oklab 180deg, oklab(97% -.0004 0.001) 30%, oklab(97% -.0004 0.001 / 0%) 100%)",
              }}
            />
          </div>

          {/* Composer */}
          <div className={bubbleShell}>
            <div className="items-center flex p-3.75 relative">
              <div className="h-[37.5px] flex w-full items-center pr-52.5 pl-[11.25px] rounded-[5.5px] overflow-clip py-[7.5px] bg-white border border-solid border-[#00000000]">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${FONT} text-[#0C0A09] text-[15px]/4.5 placeholder:text-[#78716C]`}
                  placeholder="Enter message..."
                />
              </div>
              <div className="items-center flex right-3.75 absolute">
                <div className="flex">
                  {[Smile, Paperclip, Mic].map((Icon, i) => (
                    <div
                      key={i}
                      className="items-center h-[41.25px] inline-flex w-[41.25px] justify-center rounded-full"
                    >
                      <Icon size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim()}
                  className="items-center h-[37.5px] flex justify-center ml-[11.25px] py-[7.5px] px-3.75 rounded-[5.5px] bg-white border border-solid border-[#E7E5E4] cursor-pointer hover:bg-[#F5F5F4] disabled:opacity-50 disabled:cursor-default"
                >
                  <div className={`flex text-center w-max shrink-0 ${FONT} font-medium text-[#0C0A09] text-[13.125px]/[18.75px]`}>
                    Send
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
