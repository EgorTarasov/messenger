import pb from "@/shared/pocketbase";
import type { Chat } from "../model/chat";

interface GetListChatsParams {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
  expand?: string;
}

export const getListChats = async (params: GetListChatsParams = {}) => {
  const { page = 1, perPage = 50, filter, sort = "-created", expand } = params;

  try {
    const resultList = await pb.collection("chats").getList(page, perPage, {
      filter,
      sort,
      expand,
    });

    return resultList;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    throw error;
  }
};

export const getAllChats = async (
  options: { sort?: string; filter?: string; expand?: string } = {},
) => {
  const { sort = "-created", filter, expand } = options;

  try {
    const records = await pb.collection("chats").getFullList({
      sort,
      filter,
      expand,
    });

    return records;
  } catch (error) {
    console.error("Failed to fetch all chats:", error);
    throw error;
  }
};

export const getFirstChat = async (
  filter: string,
  options: { expand?: string } = {},
) => {
  const { expand } = options;

  try {
    const record = await pb.collection("chats").getFirstListItem(filter, {
      expand,
    });

    return record;
  } catch (error) {
    console.error("Failed to fetch first chat:", error);
    throw error;
  }
};

export const getChatById = async (chatId: string): Promise<Chat> => {
  try {
    const record = await pb.collection("chats").getOne(chatId);
    return record as Chat;
  } catch (error) {
    console.error("Failed to fetch first chat:", error);
    throw error;
  }
};

interface User {
  id: string;
  username: string;
  avatar?: string;
}

export const createChat = async (
  participants: User[],
  title?: string,
): Promise<Chat> => {
  try {
    if (participants.length == 1) {
      title = participants[0].username;
    }
    const data = {
      title,
      participants: participants.map((u, _) => u.id),
    };
    const record = await pb.collection("chats").create(data);
    return record as Chat;
  } catch (error) {
    console.error("Failed to create chat:", error);
    throw error;
  }
};

export const deleteChat = async (chatId: string): Promise<void> => {
  try {
    await pb.collection("chats").delete(chatId);
  } catch (error) {
    console.error("Failed to delete chat:", error);
    throw error;
  }
};
