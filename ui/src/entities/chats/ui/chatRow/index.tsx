import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { chatsStore } from "../../model/chatListStore";

interface ChatRowProps {
  chat: Chat;
}

export const ChatRow = observer(({ chat }: ChatRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleDeleteChat = async () => {
    await chatsStore.removeChat(chat.id);
    navigate({ to: "/home" });
  };

  return (
    <div
      className="flex items-center gap-3 p-2 w-full h-full"
      onContextMenu={handleContextMenu}
    >
      <Link
        to="/home/$chatId"
        params={{ chatId: chat.id }}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src={chat.Avatar} />
          <AvatarFallback>{chat.title.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{chat.title}</div>
          {chat.participants.length > 1 && (
            <div className="text-sm text-muted-foreground">
              {chat.participants.length} participants
            </div>
          )}
        </div>
      </Link>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={handleMenuClick}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <EllipsisVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={handleDeleteChat}>
            Удалить чат
          </DropdownMenuItem>
          <DropdownMenuItem>Настройки чата</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
