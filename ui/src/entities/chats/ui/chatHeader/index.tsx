import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";

interface chatHeaderProps {
  chat: Chat;
}

export const ChatHeader = observer(({ chat }: chatHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-background border-b shadow-sm">
      <div className="flex items-center gap-3 p-4 w-full">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={chat.Avatar || ""}
            className="w-12 h-12 rounded-full"
          />
          <AvatarFallback className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
            {chat.title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">{chat.title}</h1>
      </div>
    </div>
  );
});
