import { ChatView, getChatById } from "@/entities/chats";
import { getUser } from "@/entities/user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home/$chatId")({
  component: ChatPage,
  loader: async ({ params }) => {
    const chat = await getChatById(params.chatId);
    const user = getUser()!;
    return { chat, user };
  },
  pendingComponent: () => <div>Loading chat...</div>,
  errorComponent: ({ error }) => <div>Error loading chat: {error.message}</div>,
});

function ChatPage() {
  const { chat, user } = Route.useLoaderData();

  return <ChatView chat={chat} userId={user?.id} />;
}
