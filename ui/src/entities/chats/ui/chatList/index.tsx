import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { observer } from "mobx-react-lite";
import { ChatRow } from "../chatRow";
import { Input } from "@/components/ui/input";
import { chatsStore } from "../../model/chatListStore";
import { useEffect, useState } from "react";
import { CreateChatButton } from "../createChatButton";
import { Link } from "@tanstack/react-router";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface ChatListProps {
  filterUsers: (query: string) => Promise<User[]>;
  handleNewChat: (chatId: string) => void;
}

export const ChatList = observer(
  ({ filterUsers, handleNewChat }: ChatListProps) => {
    const [localSearchQuery, setLocalSearchQuery] = useState("");

    useEffect(() => {
      chatsStore.loadChats();
    }, []);

    // Debounce search query updates
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        chatsStore.setSearchQuery(localSearchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [localSearchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchQuery(e.target.value);
    };

    const handleSuccess = (newChatId: string) => {
      handleNewChat(newChatId);
    };

    if (chatsStore.isLoading) {
      return <div>загружаем чаты...</div>;
    }

    if (chatsStore.error) {
      return <div>Error: {chatsStore.error}</div>;
    }

    return (
      <>
        <div className="flex gap-2">
          <Input
            placeholder="🔎 Поиск"
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
          <CreateChatButton
            filterUsers={filterUsers}
            handleSuccess={handleSuccess}
          />
        </div>
        <SidebarMenu>
          {chatsStore.filteredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <Link to="/home/$chatId" params={{ chatId: chat.id }}>
                <SidebarMenuButton asChild>
                  <ChatRow chat={chat} />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </>
    );
  },
);
