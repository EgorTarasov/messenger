import type { Chat } from "./chat";

interface Author {
  collectionId: string;
  collectionName: string;
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  username: string;
  avatar: string;
  created: Date; // ISO date string
  updated: Date; // ISO date string
}

interface Expand {
  author?: Author;
  chat?: Chat;
}

// TODO: add message statuses for server issues and backup into local storage?
export interface Message {
  collectionId: string;
  collectionName: string;
  id: string;
  content: string;
  chat: string;
  author: string;
  created: Date;
  updated: Date;
  expand: Expand;
}
