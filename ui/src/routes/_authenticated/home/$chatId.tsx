import { ChatView, getChatById } from "@/entities/chats";
import { getUser } from "@/entities/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home/$chatId")({
  component: ChatPage,
  loader: async ({ params }) => {
    const chat = await getChatById(params.chatId);
    const user = getUser()!;
    return { chat, user };
  },
  pendingComponent: () => <div>Loading chat...</div>,
  errorComponent: ({ error }) => <ChatNotFound error={error} />,
});

function ChatNotFound({ error }: { error: Error }) {
  const navigate = useNavigate();

  useEffect(() => {
    toast(`Ошибка при загрузке чата: ${error.message}`);
    navigate({ to: "/home" });
  }, [error.message, navigate]);

  return <></>;
}

function ChatPage() {
  const { chat, user } = Route.useLoaderData();
  const { isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  const backButton = isMobile ? (
    <ArrowLeft className="h-4 w-4" onClick={toggleSidebar} />
  ) : (
    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );

  return <ChatView chat={chat} userId={user?.id} backButton={backButton} />;
}