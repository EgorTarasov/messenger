import { observer } from "mobx-react-lite";
import { useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MessageBubble } from "../chatMessage";
import { currentChatStore } from "../../model/currentChatStore";
import type { Chat } from "../../model/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Handle scroll to load more messages
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
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

    // Auto-scroll to bottom when messages load initially or new messages arrive
    useEffect(() => {
      if (currentChatStore.messages.length > 0 && !currentChatStore.isLoadingMore) {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          // Use setTimeout to ensure DOM is updated
          setTimeout(() => {
            viewport.scrollTop = viewport.scrollHeight;
          }, 0);
        }
      }
    }, [currentChatStore.messages.length, currentChatStore.isLoadingMore]);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth",
          });
        }
      },
    }));

    return (
      <ScrollArea
        ref={scrollAreaRef}
        className="h-full bg-gradient-to-b from-blue-50 to-blue-100"
        onScrollCapture={handleScroll}
      >
        <div className="p-4">
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
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }),
);