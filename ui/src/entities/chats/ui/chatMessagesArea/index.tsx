import { observer } from "mobx-react-lite"
import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";
import { MessageBubble } from "../chatMessage";
import { currentChatStore } from "../../model/currentChatStore";
import type { Chat } from "../../model/chat";

interface MessagesAreaProps {
    chat: Chat;
    userId: string;
}

export interface MessagesAreaRef {
    scrollToBottom: () => void;
}

export const MessagesArea = observer(forwardRef<MessagesAreaRef, MessagesAreaProps>(({ chat, userId }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }));

    return (
        <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-b from-blue-50 to-blue-100"
            onScroll={handleScroll}
        >
            <div className="p-4 min-h-full">
                {/* Loading more indicator */}
                {currentChatStore.isLoadingMore && (
                    <div className="flex justify-center mb-4">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                )}

                {/* Initial loading */}
                {currentChatStore.isLoading && currentChatStore.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : currentChatStore.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-blue-600">
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
                                isGroup={chat.participants.length > 2}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
}));

