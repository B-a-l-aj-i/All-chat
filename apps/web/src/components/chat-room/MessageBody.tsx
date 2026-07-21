import { File, Play } from "lucide-react";
import { FONT, bubbleShell } from "./constants";
import type { Message } from "./types";

export function MessageBody({ message }: { message: Message }) {
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
