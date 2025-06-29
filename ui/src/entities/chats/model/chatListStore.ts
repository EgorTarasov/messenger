import { makeAutoObservable, runInAction } from "mobx";
import type { Chat } from "./chat";
import { getAllChats } from "../api/chat";

class ChatsStore {
    chats: Chat[] = [];
    searchQuery: string = "";
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get filteredChats() {
        if (!this.searchQuery.trim()) {
            return this.chats;
        }

        const query = this.searchQuery.toLowerCase();
        return this.chats.filter(chat =>
            chat.title.toLowerCase().includes(query) ||
            chat.participants.some(participant =>
                participant.toLowerCase().includes(query)
            )
        );
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
    };

    loadChats = async () => {
        this.isLoading = true;
        this.error = null;

        try {
            const result = await getAllChats({
                sort: '-updated',
                expand: 'participants'
            });

            runInAction(() => {
                this.chats = result.map(record => ({
                    collectionId: record.collectionId,
                    collectionName: record.collectionName,
                    id: record.id,
                    title: record.title,
                    Avatar: record.Avatar || `https://avatar.iran.liara.run/public/group`,
                    participants: record.participants || [],
                    created: new Date(record.created),
                    updated: new Date(record.updated)
                }));
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Failed to load chats';
                this.isLoading = false;
            });
        }
    };

    addChat = (chat: Chat) => {
        this.chats.unshift(chat);
    };

    updateChat = (chatId: string, updates: Partial<Chat>) => {
        const index = this.chats.findIndex(chat => chat.id === chatId);
        if (index !== -1) {
            this.chats[index] = { ...this.chats[index], ...updates };
        }
    };

    removeChat = (chatId: string) => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
    };
}

export const chatsStore = new ChatsStore();