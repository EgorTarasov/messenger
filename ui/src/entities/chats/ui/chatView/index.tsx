import { observer } from "mobx-react-lite"
import type { Chat } from "../../model/chat";
import { ChatInput } from "../chatInput";
import { currentChatStore } from "../../model/currentChatStore";
import { useEffect, useRef } from "react";
import { ChatHeader } from "../chatHeader";
import { MessagesArea, type MessagesAreaRef } from "../chatMessagesArea";


interface ChatViewProps {
    chat: Chat
    userId: string
}

export const ChatView = observer(({ chat, userId }: ChatViewProps) => {
    const messagesAreaRef = useRef<MessagesAreaRef>(null);

    useEffect(() => {
        currentChatStore.setChat(chat, userId)
    }, [chat.id, userId])

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollToBottom();
        }
    }, [currentChatStore.messages.length]);

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Fixed header */}
            <ChatHeader chat={chat} />

            {/* Scrollable messages area */}
            <MessagesArea ref={messagesAreaRef} chat={chat} userId={userId} />

            {/* Fixed input area */}
            <ChatInput authorId={userId} chatId={chat.id} />
        </div>
    )
})