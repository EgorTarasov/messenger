import type { Message } from "./message";

export type ChatItem =
  | {
      id: string;
      type: "message";
      data: Message;
    }
  | {
      id: string;
      type: "date";
      data: Date;
    };
