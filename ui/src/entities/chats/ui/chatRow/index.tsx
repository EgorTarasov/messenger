import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatRowProps {
  chat: Chat;
}

export const ChatRow = observer(({ chat }: ChatRowProps) => {
  return (
    <div className="flex items-center gap-3 p-2 w-full">
      <Avatar>
        <AvatarImage src={chat.Avatar} />
        <AvatarFallback>{chat.title.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{chat.title}</div>
        <div className="text-sm text-muted-foreground">
          {chat.participants.length} participants
        </div>
      </div>
    </div>
  );
});
