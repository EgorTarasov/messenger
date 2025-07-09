import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";
import type React from "react";

interface chatHeaderProps {
  chat: Chat;
  backButton?: React.ReactNode;
}

interface ChatAvatarProps {
  chat: Chat;
  size?: string;
}

const ChatAvatar = ({ chat, size = "w-10 h-10" }: ChatAvatarProps) => {
  return (
    <Avatar className={size}>
      <AvatarImage
        src={chat.Avatar || ""}
        className={`${size} rounded-full`}
      />
      <AvatarFallback className={`${size} rounded-full flex items-center justify-center bg-gray-200`}>
        {chat.title.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export const ChatHeader = observer(({ chat, backButton }: chatHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-background border-b shadow-sm">
      <div className="flex items-center justify-between p-4 w-full">
        {/* Left side - Back button or Avatar */}
        <div className="flex-shrink-0 w-12 flex justify-center items-center">
          {backButton ? (
            backButton
          ) : (
            <ChatAvatar chat={chat} />
          )}
        </div>

        {/* Center - Chat title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-semibold truncate">{chat.title}</h1>
        </div>

        {/* Right side - Avatar (only when back button is present) */}
        <div className="flex-shrink-0 w-12 flex justify-center items-center">
          {backButton && (
            <ChatAvatar chat={chat} />
          )}
        </div>
      </div>
    </div>
  );
});