import { observer } from "mobx-react-lite";
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

interface DateSeperatorProps {
  date: Date;
}

const DateSeperator = ({ date }: DateSeperatorProps) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      <div className="px-4 py-2 mx-4 bg-white/70 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm">
        <span className="text-sm font-medium text-blue-600">
          {formatDate(date)}
        </span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
    </div>
  );
};

export const MessagesArea = observer(
  forwardRef<MessagesAreaRef, MessagesAreaProps>(({ chat, userId }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Handle scroll to load more messages
    const handleScroll = useCallback(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      // Load more when scrolled to top
      if (
        container.scrollTop === 0 &&
        currentChatStore.hasMore &&
        !currentChatStore.isLoadingMore
      ) {
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
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      },
    }));

    return (
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-b from-blue-50 to-blue-100"
        onScroll={handleScroll}
      >
        <div className="p-4 ">
          {/* Loading more indicator */}
          {currentChatStore.isLoadingMore && (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          )}

          {/* Initial loading */}
          {currentChatStore.isLoading &&
          currentChatStore.messages.length === 0 ? (
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
              {currentChatStore.messagesWithSeparators.map((item) => (
                <div key={item.id}>
                  {item.type === "date" ? (
                    <DateSeperator date={item.data} />
                  ) : (
                    <MessageBubble
                      message={item.data}
                      isOwnMessage={item.data.author === userId}
                      isGroup={chat.participants.length > 2}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    );
  }),
);
