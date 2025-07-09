import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { observer } from "mobx-react-lite";
import { ChatRow } from "../chatRow";
import { Input } from "@/components/ui/input";
import { chatsStore } from "../../model/chatListStore";
import { useEffect, useState } from "react";
import { CreateChatButton } from "../createChatButton";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface ChatListProps {
  currentChatID?: string
  onCurrentChatID?: () => void;
  currentUser: User;
  filterUsers: (query: string) => Promise<User[]>;
  handleNewChat: (chatId: string) => void;
}

export const ChatList = observer(
  ({ filterUsers, handleNewChat, currentUser, currentChatID, onCurrentChatID }: ChatListProps) => {
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [activeInput, setActiveInput] = useState<boolean>(false);

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
            onFocus={() => setActiveInput(true)}
            onBlur={() => setActiveInput(false)}
          />
          {!activeInput && (
            <CreateChatButton
              currentUser={currentUser}
              filterUsers={filterUsers}
              handleSuccess={handleSuccess}
            />
          )}
        </div>
        <SidebarMenu>
          {chatsStore.filteredChats.length === 0 && (
            <>
              <div className="w-full h-16 flex items-center align-middle">
                <h5>Чаты не найдены</h5>
              </div>
            </>
          )}
          {chatsStore.filteredChats.map((chat) => {
            const isCurrent = currentChatID !== undefined && chat.id === currentChatID;
            return (
              <SidebarMenuItem key={chat.id} className="h-16 ">
                <ChatRow
                  chat={chat}
                  current={isCurrent}
                  onCurrent={onCurrentChatID || (() => { })}
                />
                <Separator />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </>
    );
  },
);