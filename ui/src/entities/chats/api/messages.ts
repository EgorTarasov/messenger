import pb from "@/shared/pocketbase";
import type { Message } from "../model/message";
import type { RecordSubscription } from "pocketbase";

interface GetListMessagesParams {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
}

interface CreateMessageData {
    content: string;
    chat: string;
    author: string;
}

interface MessageListReponse {
    page: number,
    perPage: number,
    totalPages: number,
    totalItems: number,
    items: Message[]
}

// Use PocketBase's built-in type instead of custom interface
export type RealtimeMessageEvent = RecordSubscription<Message>;

export type MessageEventCallback = (event: RealtimeMessageEvent) => void;

// Get paginated messages list
export const getListMessages = async (params: GetListMessagesParams = {}): Promise<MessageListReponse> => {
    const {
        page = 1,
        perPage = 30,
        filter,
        sort = '-created',
        expand,
        fields,
        skipTotal = false
    } = params;

    try {
        const resultList = await pb.collection('messages').getList(page, perPage, {
            filter,
            sort,
            expand,
            fields,
            skipTotal,
        });
        return resultList as MessageListReponse;
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        throw error;
    }
};

// Get all messages at once (for smaller datasets)
export const getAllMessages = async (options: {
    sort?: string;
    filter?: string;
    expand?: string;
    fields?: string;
} = {}) => {
    const { sort = '-created', filter, expand, fields } = options;

    try {
        const records = await pb.collection('messages').getFullList({
            sort,
            filter,
            expand,
            fields,
        });

        return records as Message[];
    } catch (error) {
        console.error('Failed to fetch all messages:', error);
        throw error;
    }
};

// Get first message that matches filter
export const getFirstMessage = async (filter: string, options: {
    expand?: string;
    fields?: string;
} = {}) => {
    const { expand, fields } = options;

    try {
        const record = await pb.collection('messages').getFirstListItem(filter, {
            expand,
            fields,
        });

        return record as Message;
    } catch (error) {
        console.error('Failed to fetch first message:', error);
        throw error;
    }
};

// Get message by ID
export const getMessageById = async (messageId: string, options: {
    expand?: string;
    fields?: string;
} = {}): Promise<Message> => {
    const { expand, fields } = options;

    try {
        const record = await pb.collection('messages').getOne(messageId, {
            expand,
            fields,
        });
        return record as Message;
    } catch (error) {
        console.error('Failed to fetch message:', error);
        throw error;
    }
};

// Create new message
export const createMessage = async (data: CreateMessageData, options: {
    expand?: string;
    fields?: string;
} = {}): Promise<Message> => {
    const { expand, fields } = options;

    try {
        const record = await pb.collection('messages').create(data, {
            expand,
            fields,
        });
        return record as Message;
    } catch (error) {
        console.error('Failed to create message:', error);
        throw error;
    }
};

// Get messages for specific chat
export const getChatMessages = async (chatId: string, options: {
    page?: number;
    perPage?: number;
    sort?: string;
    expand?: string;
} = {}): Promise<MessageListReponse> => {
    const {
        page = 1,
        perPage = 50,
        sort = '-created',
        expand = 'author'
    } = options;

    return getListMessages({
        page,
        perPage,
        filter: `chat="${chatId}"`,
        sort,
        expand,
    });
};

// Search messages by content
export const searchMessages = async (query: string, options: {
    chatId?: string;
    page?: number;
    perPage?: number;
    sort?: string;
    expand?: string;
} = {}) => {
    const {
        chatId,
        page = 1,
        perPage = 30,
        sort = '-created',
        expand = 'author,chat'
    } = options;

    let filter = `content~"${query}"`;
    if (chatId) {
        filter += ` && chat="${chatId}"`;
    }

    return getListMessages({
        page,
        perPage,
        filter,
        sort,
        expand,
    });
};

// Realtime API functions
export const subscribeToAllMessages = (callback: MessageEventCallback, options: {
    filter?: string;
    expand?: string;
} = {}) => {
    const { filter, expand = 'author' } = options;

    try {
        return pb.collection('messages').subscribe('*', callback, {
            filter,
            expand,
        });
    } catch (error) {
        console.error('Failed to subscribe to messages:', error);
        throw error;
    }
};

export const subscribeToChatMessages = (chatId: string, callback: MessageEventCallback, options: {
    expand?: string;
} = {}) => {
    const { expand = 'author' } = options;

    try {
        return pb.collection('messages').subscribe('*', callback, {
            filter: `chat="${chatId}"`,
            expand,
        });
    } catch (error) {
        console.error('Failed to subscribe to chat messages:', error);
        throw error;
    }
};

export const subscribeToMessage = (messageId: string, callback: MessageEventCallback, options: {
    expand?: string;
} = {}) => {
    const { expand = 'author' } = options;

    try {
        return pb.collection('messages').subscribe(messageId, callback, {
            expand,
        });
    } catch (error) {
        console.error('Failed to subscribe to message:', error);
        throw error;
    }
};

export const unsubscribeFromMessages = (topic?: string) => {
    try {
        return pb.collection('messages').unsubscribe(topic);
    } catch (error) {
        console.error('Failed to unsubscribe from messages:', error);
        throw error;
    }
};

export const unsubscribeFromAllMessages = () => {
    try {
        return pb.collection('messages').unsubscribe();
    } catch (error) {
        console.error('Failed to unsubscribe from all messages:', error);
        throw error;
    }
};