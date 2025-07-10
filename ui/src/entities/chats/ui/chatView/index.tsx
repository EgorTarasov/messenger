import { observer } from "mobx-react-lite";
import type { Chat } from "../../model/chat";
import { ChatInput } from "../chatInput";
import { currentChatStore } from "../../model/currentChatStore";
import React, { useEffect, useRef } from "react";
import { ChatHeader } from "../chatHeader";
import { MessagesArea, type MessagesAreaRef } from "../chatMessagesArea";


interface ChatViewProps {
  chat: Chat;
  userId: string;
  backButton?: React.ReactNode
}

export const ChatView = observer(({ chat, userId, backButton }: ChatViewProps) => {
  const messagesAreaRef = useRef<MessagesAreaRef>(null);

  useEffect(() => {
    currentChatStore.setChat(chat, userId);
  }, [chat.id, userId]);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollToBottom();
    }
  }, [currentChatStore.messages.length]);

  return (
    <div className="flex flex-col h-screen md:h-full relative">
      {/* Fixed header - always at top */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
        <ChatHeader chat={chat} backButton={backButton} />
      </div>

      {/* Scrollable messages area - with top padding for fixed header */}
      <div className="flex-1 min-h-0 pt-16 pb-[80px] md:pb-0">
        <MessagesArea ref={messagesAreaRef} chat={chat} userId={userId} />
      </div>

      {/* Fixed input area - positioned at bottom on mobile */}
      <div className="flex-shrink-0 p-3 md:p-4 fixed bottom-0 left-0 right-0 bg-white border-t md:border-t-0 z-30 md:static">
        <ChatInput authorId={userId} chatId={chat.id} />
      </div>
    </div>
  );
});