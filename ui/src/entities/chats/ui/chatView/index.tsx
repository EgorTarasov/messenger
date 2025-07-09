import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";
import { ChatInput } from "../chatInput";
import { currentChatStore } from "../../model/currentChatStore";
import { useEffect, useRef } from "react";
import { ChatHeader } from "../chatHeader";
import { MessagesArea, type MessagesAreaRef } from "../chatMessagesArea";

interface ChatViewProps {
  chat: Chat;
  userId: string;
}

export const ChatView = observer(({ chat, userId }: ChatViewProps) => {
  const messagesAreaRef = useRef<MessagesAreaRef>(null);

  useEffect(() => {
    currentChatStore.setChat(chat, userId);
  }, [chat.id, userId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollToBottom();
    }
  }, [currentChatStore.messages.length]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <ChatHeader chat={chat} />
      </div>

      {/* Scrollable messages area - constrain this */}
      <div className="flex-1 overflow-hidden"> {/* Add overflow-hidden */}
        <MessagesArea ref={messagesAreaRef} chat={chat} userId={userId} />
      </div>

      {/* Fixed input area */}
      <div className="flex-shrink-0">
        <ChatInput authorId={userId} chatId={chat.id} />
      </div>
    </div>
  );
});
