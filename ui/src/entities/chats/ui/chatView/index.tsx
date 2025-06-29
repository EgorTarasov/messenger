import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { observer } from "mobx-react-lite"
import type { Chat } from "../../model/chat";
import { ChatInput } from "../chatInput";
import { currentChatStore } from "../../model/currentChatStore";
import { useEffect, useRef, useCallback } from "react";
import type { Message } from "../../model/message";
import { Loader2 } from "lucide-react";

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

const MessageBubble = ({ message, isOwnMessage }: MessageBubbleProps) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
                }`}>
                {!isOwnMessage && message.expand && message.expand.author !== undefined && (
                    <div className="text-xs font-semibold mb-1 opacity-70">
                        {message.expand.author.username || message.expand.author.name}
                    </div>
                )}
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {formatTime(message.created.toString())}
                </div>
            </div>
        </div>
    );
};

interface ChatViewProps {
    chat: Chat
    userId: string
}

export const ChatView = observer(({ chat, userId }: ChatViewProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        currentChatStore.setChat(chat, userId)
    }, [chat.id, userId])

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentChatStore.messages.length]);

    // Handle scroll to load more messages
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Load more when scrolled to top
        if (container.scrollTop === 0 && currentChatStore.hasMore && !currentChatStore.isLoadingMore) {
            const prevScrollHeight = container.scrollHeight;

            currentChatStore.loadMoreMessages().then(() => {
                // Maintain scroll position after loading older messages
                requestAnimationFrame(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - prevScrollHeight;
                });
            });
        }
    }, []);
    // FIXME: split into 3 components
    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Fixed header */}
            <div className="flex-shrink-0 bg-background border-b">
                <div className="flex items-center gap-3 p-4 w-full">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={chat.Avatar || ""} className="w-12 h-12 rounded-full" />
                        <AvatarFallback className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
                            {chat.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-xl font-semibold">{chat.title}</h1>
                </div>
            </div>

            {/* Scrollable messages area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto min-h-0"
                onScroll={handleScroll}
            >
                <div className="p-4 min-h-full">
                    {/* Loading more indicator */}
                    {currentChatStore.isLoadingMore && (
                        <div className="flex justify-center mb-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}

                    {/* Initial loading */}
                    {currentChatStore.isLoading && currentChatStore.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : currentChatStore.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <p className="text-lg">Нет сообщений</p>
                                <p className="text-sm">Начните разговор!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentChatStore.messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwnMessage={message.author === userId}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed input area */}
            <div className="flex-shrink-0 bg-background border-t p-4">
                <ChatInput authorId={userId} chatId={chat.id} />
            </div>
        </div>
    )
})