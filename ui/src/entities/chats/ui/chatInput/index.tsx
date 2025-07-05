import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react";
import { observer } from "mobx-react-lite"
import { useState } from "react";
import { createMessage } from "../../api/messages";
import type { Message } from "../../model/message";
import { currentChatStore } from "../../model/currentChatStore";

interface ChatInputProps {
    chatId: string
    authorId: string
}

export const ChatInput = observer(({ chatId, authorId }: ChatInputProps) => {
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log("Sending message:", message, chatId, authorId);
            // 1) insert new message into store
            // 2) send request to server
            createMessage({
                content: message,
                chat: chatId,
                author: authorId
            }).then((res: Message) => {
                currentChatStore.addMessage(res)
            })

            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return <div className="flex-shrink-0 bg-background border-t p-4">

        <div className="flex gap-2 items-end">
            <div className="flex-1">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите сообщение..."
                    className="resize-none"
                    autoComplete="off"
                />
            </div>
            <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    </div>
})