import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { createMessage } from "../../api/messages";
import type { Message } from "../../model/message";
import { currentChatStore } from "../../model/currentChatStore";

interface ChatInputProps {
  chatId: string;
  authorId: string;
}

export const ChatInput = observer(({ chatId, authorId }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message, chatId, authorId);
      createMessage({
        content: message,
        chat: chatId,
        author: authorId,
      }).then((res: Message) => {
        currentChatStore.addMessage(res);
      });

      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 md:gap-3 items-end">
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            className="resize-none h-10 md:h-12 text-base"
            autoComplete="off"
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="icon"
          className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 h-10 w-10 md:h-12 md:w-12 flex-shrink-0"
        >
          <Send className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
});