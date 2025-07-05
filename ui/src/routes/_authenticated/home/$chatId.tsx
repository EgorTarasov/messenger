import { ChatView, getChatById } from "@/entities/chats";
import { getUser } from "@/entities/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/home/$chatId")({
  component: ChatPage,
  loader: async ({ params }) => {
    const chat = await getChatById(params.chatId);
    const user = getUser()!;
    return { chat, user };
  },
  pendingComponent: () => <div>Loading chat...</div>,
  errorComponent: ({ error }) => chatNotFound(error),
});

const chatNotFound = (error: Error) => {
  toast(`Ошибка при загрузке чата: ${error.message}`);
  const navigate = useNavigate();
  navigate({ to: "/home" });
  return <></>;
};

function ChatPage() {
  const { chat, user } = Route.useLoaderData();

  return <ChatView chat={chat} userId={user?.id} />;
}
