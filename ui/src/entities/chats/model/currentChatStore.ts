import { makeAutoObservable, runInAction } from "mobx";
import type { Chat } from "./chat";
import type { Message } from "./message"
import {
    getChatMessages,
    subscribeToChatMessages,
    type RealtimeMessageEvent
} from "../api/messages";

const pageSize = 20;

class CurrentChatStore {
    chat: Chat | null = null
    senderId: string = ""
    messages: Message[] = []
    isLoading: boolean = false
    isLoadingMore: boolean = false
    currentPage: number = 1
    hasMore: boolean = true
    totalItems: number = 0


    private realtimeUnsubscribe: (() => void) | null = null

    constructor() {
        makeAutoObservable(this);
    }


    async setChat(chat: Chat, senderId: string) {
        if (this.chat?.id !== chat.id) {
            // Unsubscribe from previous chat
            this.unsubscribeFromRealtime();

            // Reset state when switching chats
            this.chat = chat
            this.senderId = senderId
            this.messages = []
            this.currentPage = 1
            this.hasMore = true
            this.totalItems = 0

            // Load initial messages
            await this.loadMessages()

            // Subscribe to realtime updates for this chat
            await this.subscribeToRealtime();
        } else {
            this.senderId = senderId
        }
    }

    private async subscribeToRealtime() {
        if (!this.chat) return;

        try {
            // Await the subscription and store the unsubscribe function
            this.realtimeUnsubscribe = await subscribeToChatMessages(
                this.chat.id,
                this.handleRealtimeEvent.bind(this)
            );
        } catch (error) {
            console.error('Failed to subscribe to realtime updates:', error);
        }
    }

    private unsubscribeFromRealtime() {
        if (this.realtimeUnsubscribe) {
            try {
                this.realtimeUnsubscribe();
                this.realtimeUnsubscribe = null;
            } catch (error) {
                console.error('Failed to unsubscribe from realtime:', error);
            }
        }
    }

    private handleRealtimeEvent(event: RealtimeMessageEvent) {
        runInAction(() => {
            switch (event.action) {
                case 'create':
                    // Add new message if it doesn't already exist
                    if (!this.messages.find(m => m.id === event.record.id)) {
                        this.messages.push(event.record);
                        this.totalItems += 1;
                    }
                    break;

                case 'update':
                    // Update existing message
                    const updateIndex = this.messages.findIndex(m => m.id === event.record.id);
                    if (updateIndex !== -1) {
                        this.messages[updateIndex] = event.record;
                    }
                    break;

                case 'delete':
                    // Remove deleted message
                    this.messages = this.messages.filter(m => m.id !== event.record.id);
                    this.totalItems = Math.max(0, this.totalItems - 1);
                    break;
            }
        });
    }

    async loadMessages(reset: boolean = false) {
        if (!this.chat || this.isLoading) {
            return
        }

        if (reset) {
            this.currentPage = 1
            this.hasMore = true
            this.messages = []
        }

        this.isLoading = true

        try {
            const response = await getChatMessages(this.chat.id, {
                page: this.currentPage,
                perPage: pageSize,
                sort: 'created', // Oldest first for proper message order
                expand: 'author'
            })

            runInAction(() => {
                if (reset) {
                    this.messages = response.items
                } else {
                    // Prepend older messages to the beginning
                    this.messages = [...response.items, ...this.messages]
                }

                this.totalItems = response.totalItems
                this.hasMore = response.page < response.totalPages
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.isLoading = false
            })
            console.error('Failed to load messages:', error)
        }
    }

    async loadMoreMessages() {
        if (!this.hasMore || this.isLoadingMore || this.isLoading) {
            return
        }

        this.isLoadingMore = true
        this.currentPage += 1

        try {
            const response = await getChatMessages(this.chat!.id, {
                page: this.currentPage,
                perPage: pageSize,
                sort: 'created',
                expand: 'author'
            })

            runInAction(() => {
                // Prepend older messages
                this.messages = [...response.items, ...this.messages]
                this.hasMore = response.page < response.totalPages
                this.isLoadingMore = false
            })
        } catch (error) {
            runInAction(() => {
                this.isLoadingMore = false
                this.currentPage -= 1 // Revert page increment on error
            })
            console.error('Failed to load more messages:', error)
        }
    }

    addMessage(message: Message) {
        // This method is now primarily for optimistic updates
        // The realtime subscription will handle the actual updates
        if (!this.messages.find(m => m.id === message.id)) {
            this.messages.push(message);
            this.totalItems += 1;
        }
    }

    async refreshMessages() {
        await this.loadMessages(true)
    }

    getMessages(): Message[] {
        return this.messages
    }

    // Cleanup method to call when store is destroyed
    destroy() {
        this.unsubscribeFromRealtime();
    }
}

export const currentChatStore = new CurrentChatStore();

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        currentChatStore.destroy();
    });
}