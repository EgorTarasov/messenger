import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import { useEffect, useState } from "react";
import type { Message } from "../../model/message";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteMessage } from "../../api/messages";
import { getUserAvatar } from "@/entities/user/api/user";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isGroup: boolean;
}
export const MessageBubble = ({
  message,
  isOwnMessage,
  isGroup,
}: MessageBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load avatar URL when component mounts
  useEffect(() => {
    if (message.expand && message.expand.author) {
      getUserAvatar(message.expand.author)
        .then((url) => {
          setAvatarUrl(url);
        })
        .catch((error) => {
          console.error("Failed to load avatar:", error);
          setAvatarUrl(null);
        });
    }
  }, [message.expand?.author]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast("текст сообщения скопирован");
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Не удалось скопировать текст");
    }
  };

  const handleDeleteMessage = async () => {
    if (isOwnMessage && message) {
      try {
        await deleteMessage(message.id);
        toast("Сообщение удалено");
      } catch (error) {
        console.error("Failed to delete message:", error);
        toast.error("Не удалось удалить сообщение");
      }
    }
    setIsOpen(false);
  };

  if (isOwnMessage) {
    return (
      <>
        <div className={`flex justify-end  mb-4`}>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg  bg-blue-500 text-white`}
                onContextMenu={handleContextMenu}
              >
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 text-blue-100`}>
                  {formatTime(message.created.toString())}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleCopyText}>
                Копировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteMessage}>
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  }

  return (
    <div className={`flex justify-start mb-4 cursor-pointer`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white text-gray-800`}
            onContextMenu={handleContextMenu}
          >
            {message.expand && message.expand.author !== undefined && (
              <div className="flex items-center gap-2 text-xs font-semibold mb-1 opacity-70">
                {isGroup && (
                  <Avatar className="w-4 h-4">
                    <AvatarImage
                      src={avatarUrl || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback className="text-xs">
                      {message.expand ? message.expand.author.name[0] : "CN"}
                    </AvatarFallback>
                  </Avatar>
                )}
                {message.expand.author.username || message.expand.author.name}
              </div>
            )}
            <div className="text-sm">{message.content}</div>
            <div className={`text-xs mt-1  text-gray-500`}>
              {formatTime(message.created.toString())}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleCopyText}>
            Копировать
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
